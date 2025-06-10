from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.response import Response
from .models import Project, ToDoItem, Note, PersonalDependency, Technology, Message
from .serializers import ProjectSerializer, ToDoItemSerializer, NoteSerializer, PersonalDependencySerializer, TechnologySerializer, MessageSerializer
from django.contrib.auth import get_user_model
from rest_framework.exceptions import ValidationError

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
        #return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)
        raise ValidationError({"error":"Project not found!!!"})

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
        #return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)
        raise ValidationError({"error":"Project not found!!!"})
    
    if project.owner != request.user:
        return Response({'detail': 'Only the owner can add users!'}, status=status.HTTP_403_FORBIDDEN)
    email = request.data.get('email')

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        #return Response({'detail': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)
        raise ValidationError({"error":"User not found!!"})
    
    project.shared_with.add(user)
    return Response({'detail': 'User added.'}, status=status.HTTP_200_OK)


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def todoCreate(request, project_id):
    try:
        project=Project.objects.get(pk=project_id)
    except Project.DoesNotExist:
        #return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)
        raise ValidationError({"error":"Project not found!!!"})
    
    if not project.owner_or_shared(request.user):
        return Response({'detail': 'Not allowed!'}, status=status.HTTP_403_FORBIDDEN)
    
    if request.method == 'GET':
        todos = project.todo_items.all()
        serializer=ToDoItemSerializer(todos, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = ToDoItemSerializer(data=request.data, context={'project': project})
        if serializer.is_valid():
            serializer.save(project=project)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET','PATCH', 'DELETE'])
@permission_classes([IsAuthenticated])
def todoChange(request, pk):
    try:
        todo = ToDoItem.objects.get(pk=pk)
    except ToDoItem.DoesNotExist:
        #return Response({'detail':'Not found.'}, status=status.HTTP_404_NOT_FOUND)
        raise ValidationError({"error":"Todo not found!"})
    
    if not todo.project.owner_or_shared(request.user):
        return Response({'detail': 'Not allowed!'}, status=status.HTTP_403_FORBIDDEN)
    
    if request.method == 'GET':
        serializer = ToDoItemSerializer(todo)
        return Response(serializer.data)

    if request.method == 'PATCH':
        serializer = ToDoItemSerializer(todo,data=request.data, partial = True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        todo.delete()
        return Response(status = status.HTTP_204_NO_CONTENT)
    

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def noteCreate(request, project_id):
    try:
        project = Project.objects.get(pk=project_id)
    except Project.DoesNotExist:
        #return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)
        raise ValidationError({"error":"Project not found!!!"})
    
    if not project.owner_or_shared(request.user):
        return Response({'detail': 'Not allowed!!'}, status=status.HTTP_403_FORBIDDEN)

    if request.method == 'GET':
        notes = project.notes.all()
        serializer = NoteSerializer(notes, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = NoteSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(project=project)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PATCH', 'DELETE'])
@permission_classes([IsAuthenticated])
def noteChange(request, pk):
    try:
        note = Note.objects.get(pk=pk)
    except Note.DoesNotExist:
        #return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)
        raise ValidationError({"error":"Note not found!"})
    
    if not note.project.owner_or_shared(request.user):
        return Response({'detail': 'Not allowed!!'}, status=status.HTTP_403_FORBIDDEN)

    if request.method == 'GET':
        serializer = NoteSerializer(note)
        return Response(serializer.data)

    elif request.method == 'PATCH':
        serializer = NoteSerializer(note, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        note.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def technologyGlobalAdd(request):
    if request.method == 'GET':
        technologies = Technology.objects.all()
        serializer = TechnologySerializer(technologies, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        serializer = TechnologySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def technologyProjectList(request, project_id):
    try:
        project = Project.objects.get(pk=project_id)
    except Project.DoesNotExist:
        #return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)
        raise ValidationError({"error":"Project not found!!!"})
    
    technologies = project.technologies.all()
    serializer = TechnologySerializer(technologies, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def technologyProjectAdd(request, project_id):
    try:
        project = Project.objects.get(pk=project_id)
    except Project.DoesNotExist:
        #return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)
        raise ValidationError({"error":"Project not found!!!"})
    
    if project.owner != request.user:
        return Response({'detail': 'Only the owner can add technologies!'}, status=status.HTTP_403_FORBIDDEN)
    
    tech_name = request.data.get('name')
    if not tech_name:
        return Response({'detail': 'Technology name is required.'}, status=status.HTTP_400_BAD_REQUEST)
    
    technology, created = Technology.objects.get_or_create(name=tech_name)
    project.technologies.add(technology)
    return Response(TechnologySerializer(technology).data, status=status.HTTP_201_CREATED)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def technologyRemove(request, project_id, tech_id):
    try:
        project = Project.objects.get(pk=project_id)
        technology = Technology.objects.get(pk=tech_id)
    except (Project.DoesNotExist, Technology.DoesNotExist):
        #return Response({'detail': 'Project found.'}, status=status.HTTP_404_NOT_FOUND)
        raise ValidationError({"error":"Project/Technology not found!!!"})
    
    if project.owner != request.user:
        return Response({'detail': 'Only the owner can delete technologies!!!'}, status=status.HTTP_403_FORBIDDEN)
    project.technologies.remove(technology)
    return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def personalDependencyCreate(request, project_id):
    try:
        project=Project.objects.get(pk=project_id)
    except Project.DoesNotExist:
        #return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)
        raise ValidationError({"error":"Project not found!!!"})
    
    if not project.owner_or_shared(request.user):
        return Response({'detail': 'Not allowed!'}, status=status.HTTP_403_FORBIDDEN)

    if request.method == 'GET':
        dependencies = project.personal_dependencies.all()
        serializer = PersonalDependencySerializer(dependencies, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        if project.owner != request.user:
            return Response({'detail': 'Only the owner can write personal dependencies!'}, status=status.HTTP_403_FORBIDDEN)
            
        serializer = PersonalDependencySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(project=project)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PATCH', 'DELETE'])
@permission_classes([IsAuthenticated])
def personaldDependencyChange(request, pk):
    try:
        dependency = PersonalDependency.objects.get(pk=pk)
    except PersonalDependency.DoesNotExist:
        #return Response({'detail':'Not found.'}, status=status.HTTP_404_NOT_FOUND)
        raise ValidationError({"error":"Dependecy not found!!!"})
    
    if dependency.project.owner != request.user:
        return Response({'detail': 'Only the owner can wrrite personal dependencies!!'}, status=status.HTTP_403_FORBIDDEN)

    if request.method == 'GET':
        serializer = PersonalDependencySerializer(dependency)
        return Response(serializer.data)

    elif request.method =='PATCH':
        serializer = PersonalDependencySerializer(dependency, data=request.data,partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        dependency.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def groupchat(request, project_id):
    try:
        project = Project.objects.get(pk=project_id)
    except Project.DoesNotExist:
        raise ValidationError({"error":"Project not found!!!"})
    
    if not project.owner_or_shared(request.user):
        return Response({'detail': 'Not allowed!'}, status=status.HTTP_403_FORBIDDEN)
    
    if request.method == 'GET':
        messages = project.messages.all().order_by('created_at')
        serializer = MessageSerializer(messages, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        serializer = MessageSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(project=project, sender=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)