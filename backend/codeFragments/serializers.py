from rest_framework import serializers
from .models import CodeLibrary, CodeFragment

class CodeFragmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = CodeFragment
        fields = ['id', 'title', 'code', 'description', 'date', 'codeLibrary']
        read_only_fields = ['id', 'date', 'codeLibrary']

class CodeLibrarySerializer(serializers.ModelSerializer):
    fragments = CodeFragmentSerializer(source='code_fragments', many=True, read_only=True)

    class Meta:
        model = CodeLibrary
        fields = ['id', 'language', 'fragments']
        read_only_fields = ['id']
