from rest_framework import serializers
from models.models import Club

class ClubBeefSerializer(serializers.ModelSerializer):
    kos_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Club
        fields = ['id', 'name', 'path_image', 'kos_count']