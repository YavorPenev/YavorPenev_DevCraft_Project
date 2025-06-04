from rest_framework import serializers
from .models import Project, Technology, Note, PersonalDependency, ToDoItem

class TechnologySerializer(serializers.ModelSerializer):
    class Meta:
        model= Technology
        fields= ['id', 'name']

class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model =Note
        fields= ['id', 'title', 'content', 'created_at']

class PersonalDependencySerializer(serializers.ModelSerializer):
    class Meta:
        model = PersonalDependency
        fields = ['id', 'name', 'value']

class ToDoItemSerializer(serializers.ModelSerializer):
    class Meta:
        model =ToDoItem
        fields= ['id', 'date', 'task', 'state']

class ProjectSerializer(serializers.ModelSerializer):
    technologies =TechnologySerializer(many=True, read_only=True)
    notes =NoteSerializer(many=True, read_only=True)
    personal_dependencies = PersonalDependencySerializer(many=True, read_only=True)
    todo_items =ToDoItemSerializer(many=True, read_only=True)
    class Meta:
        model =Project
        fields=[
            'id', 'name', 'owner', 'start_date', 'end_date', 'description', 'technologies', 'dependencies', 'github_link', 'shared_with',
            'created_at', 'updated_at', 'notes', 'personal_dependencies',
            'todo_items'
        ]
        read_only_fields= ['id', 'owner', 'created_at', 'updated_at']