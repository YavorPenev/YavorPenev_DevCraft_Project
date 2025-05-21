from rest_framework import serializers
from .models import Ideas

class IdeaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ideas
        fields = ['id', 'title', 'description', 'date']
        read_only_fields = ['id', 'date']