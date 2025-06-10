from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .models import Ideas
from .serializers import IdeaSerializer
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def idea_create(request):
    if request.method == 'GET':
        search_query = request.GET.get('search', '').strip()
        ideas = Ideas.objects.filter(user=request.user)
        if search_query:
            ideas = ideas.filter(title__icontains=search_query)
        ideas = ideas.order_by('-date')
        serializer = IdeaSerializer(ideas, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    elif request.method == 'POST':
        serializer = IdeaSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PATCH', 'DELETE'])
@permission_classes([IsAuthenticated])
def idea_change(request, pk):
    try:
        idea = Ideas.objects.get(pk=pk, user=request.user)
    except Ideas.DoesNotExist:
        #return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)
        raise ValidationError({"error":"Idea not found!!!"} )

    if request.method == 'GET':
        serializer = IdeaSerializer(idea)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    elif request.method == 'PATCH':
        serializer = IdeaSerializer(idea, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        idea.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
