from rest_framework import serializers
from .models import Library, Sources

class SourcesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sources
        fields = [
         'id', 'library', 'type', 'description', 'image', 'url', 'file',
        'note_title', 'note_description']
        read_only_fields = ['id', 'library']

class LibrarySerializer(serializers.ModelSerializer):
    sources = SourcesSerializer(many=True, read_only=True)
    class Meta:
        model = Library
        fields = ['id', 'name', 'date', 'sources']
        read_only_fields = ['id', 'date']