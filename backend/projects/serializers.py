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

    def validate(self, attrs):
        project =self.instance.project if self.instance else self.context.get('project')
        date = attrs.get('date', getattr(self.instance, 'date', None))
        if project and date:
            if not (project.start_date <= date <= project.end_date):
                raise serializers.ValidationError(
                    {"date": "Date must be between the project's start and end date!!"}
                )
        return attrs

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