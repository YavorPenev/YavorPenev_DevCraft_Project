from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .models import CodeFragment, CodeLibrary
from .serializers import CodeFragmentSerializer, CodeLibrarySerializer
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError


@api_view(['GET','POST'])
@permission_classes([IsAuthenticated])
def codeLibrary_create(request):
    if request.method == 'GET':
        codeLibraries = CodeLibrary.objects.filter(user = request.user)
        serrializer = CodeLibrarySerializer(codeLibraries, many=True)
        return Response(serrializer.data, status=status.HTTP_200_OK)
    
    elif request.method == 'POST':
        serrializer = CodeLibrarySerializer(data=request.data)
        if serrializer.is_valid():
            serrializer.save(user=request.user)
            return Response(serrializer.data, status=status.HTTP_201_CREATED)
        return Response(serrializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET','PATCH', 'DELETE'])
@permission_classes([IsAuthenticated])
def codeLibrary_change(request, pk):
    try:
        codeLibrary = CodeLibrary.objects.get(user = request.user, pk = pk)
    except CodeLibrary.DoesNotExist:
        raise ValidationError ({"error":"Code Library not found!!!"} )
    
    if request.method == 'GET':
        serializer = CodeLibrarySerializer(codeLibrary)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    elif request.method == 'PATCH': 
        serializer = CodeLibrarySerializer(codeLibrary, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        codeLibrary.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET','POST'])
@permission_classes([IsAuthenticated])
def fragments_create(request, codeLibrary_id):

    try:
        codeLibrary = CodeLibrary.objects.get(pk = codeLibrary_id, user = request.user)
    except CodeLibrary.DoesNotExist:
        raise ValidationError({"error":"Code Library not found!!!"} )

    if request.method == 'GET':
        search_query = request.GET.get('search','').strip()
        codeFragments = codeLibrary.code_fragments.all()        
        if search_query:
            codeFragments = codeFragments.filter(title__icontains=search_query)
        codeFragments = codeFragments.order_by('title')
        serrializer = CodeFragmentSerializer(codeFragments, many=True)
        return Response(serrializer.data, status=status.HTTP_200_OK)
    
    elif request.method == 'POST':
        serrializer = CodeFragmentSerializer(data=request.data)
        if serrializer.is_valid():
            serrializer.save(codeLibrary=codeLibrary)
            return Response(serrializer.data, status=status.HTTP_201_CREATED)
        return Response(serrializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET','PATCH', 'DELETE'])
@permission_classes([IsAuthenticated])
def fragments_change(request, pk):
    try:
        codeFragment = CodeFragment.objects.get(pk = pk, codeLibrary__user=request.user)
    except CodeFragment.DoesNotExist:
        raise ValidationError({"error":"Code fragment not found!!!"} )
    
    if request.method == 'GET':
        serializer = CodeFragmentSerializer(codeFragment)
        return Response(serializer.data, status=status.HTTP_200_OK)

    elif request.method == 'PATCH':
        serializer = CodeFragmentSerializer(codeFragment, data = request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        codeFragment.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
