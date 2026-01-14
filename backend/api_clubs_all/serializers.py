from rest_framework import serializers
from models.models import Club


class ClubSerializer(serializers.ModelSerializer):
    class Meta:
        model = Club
        fields = ['id', 'name', 'city', 'path_image', 'points']
