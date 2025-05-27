from django.shortcuts import render
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from .models import Library, Sources
from .serializers import LibrarySerializer, SourcesSerializer
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def library_create(request):
    if request.method == 'GET':
        search_query = request.GET.get('search', '')
        libraries = Library.objects.filter(user = request.user)
        if search_query:
            libraries = libraries.filter(name__icontains=search_query)
        libraries = libraries.order_by('-date')
        serializer = LibrarySerializer(libraries, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    elif request.method == 'POST':
        serializer = LibrarySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['GET', 'PATCH', 'DELETE'])
@permission_classes([IsAuthenticated])
def library_change(request, pk):

    try:
        library = Library.objects.get(pk = pk, user = request.user)
    except Library.DoesNotExist:
        return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = LibrarySerializer(library)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    elif request.method == 'PATCH':
        serializer = LibrarySerializer(library, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        library.delete()
        return Response( status=status.HTTP_204_NO_CONTENT)
    
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def sources_create(request, library_id):
    try:
        library = Library.objects.get(pk=library_id, user=request.user)
    except Library.DoesNotExist:
        raise ValidationError({"error":"Library not found!!!"})

    if request.method == 'GET':
        sources = library.sources.all().order_by('-id')
        serializer = SourcesSerializer(sources, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    elif request.method == 'POST':
        serializer = SourcesSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(library=library)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PATCH', 'DELETE'])
@permission_classes([IsAuthenticated])
def sources_change(request, pk):
    try:
        source = Sources.objects.get(pk=pk, library__user=request.user)
    except Sources.DoesNotExist:
        return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = SourcesSerializer(source)
        return Response(serializer.data, status=status.HTTP_200_OK)

    elif request.method == 'PATCH':
        serializer = SourcesSerializer(source, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        source.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)