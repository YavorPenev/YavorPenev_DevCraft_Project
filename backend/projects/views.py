from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.response import Response
from .models import Project, ToDoItem, Note, PersonalDependency, Technology
from .serializers import ProjectSerializer, ToDoItemSerializer, NoteSerializer, PersonalDependencySerializer, TechnologySerializer
from django.contrib.auth import get_user_model

User = get_user_model()

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def projectCreate(request):
    if request.method == 'GET':
        search_query = request.GET.get('search', '').strip()
        projects = Project.objects.filter(owner=request.user) | Project.objects.filter(shared_with=request.user)
        projects = projects.distinct().order_by('-created_at')
        if search_query:
            projects = projects.filter(name__icontains=search_query)
        serializer = ProjectSerializer(projects, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        serializer = ProjectSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(owner=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PATCH', 'DELETE'])
@permission_classes([IsAuthenticated])
def projectChange(request, pk):
    try:
        project = Project.objects.get(pk=pk)
    except Project.DoesNotExist:
        return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)

    if not project.owner_or_shared(request.user):
        return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = ProjectSerializer(project)
        return Response(serializer.data)

    elif request.method == 'PATCH':
        if project.owner != request.user:
            allowed_fields = []
            for field in request.data:
                if field not in allowed_fields:
                    return Response({'detail': 'You do not have permission to edit this field!!'}, status=status.HTTP_403_FORBIDDEN)
        serializer = ProjectSerializer(project, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        if project.owner != request.user:
            return Response({'detail': 'Only the owner can delete the project!!!'}, status=status.HTTP_403_FORBIDDEN)
        project.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_user_to_project(request, pk):
    try:
        project = Project.objects.get(pk=pk)
    except Project.DoesNotExist:
        return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)
    
    if project.owner != request.user:
        return Response({'detail': 'Only the owner can add users!'}, status=status.HTTP_403_FORBIDDEN)
    email = request.data.get('email')

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response({'detail': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)
    
    project.shared_with.add(user)
    return Response({'detail': 'User added.'}, status=status.HTTP_200_OK)