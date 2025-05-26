from rest_framework import serializers
from .models import Library, Sources

class SourcesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sources
        fields = '__all__'
        read_only_fields = ['id', 'library']

class LibrarySerializer(serializers.ModelSerializer):
    sources = SourcesSerializer(many=True, read_only=True)
    class Meta:
        model = Library
        fields = ['id', 'name', 'date', 'sources']
        read_only_fields = ['id', 'date']