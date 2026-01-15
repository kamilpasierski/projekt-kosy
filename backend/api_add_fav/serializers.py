from rest_framework import serializers
from ..models.models import UserProfile
from ..models.models import Club

class UserClubSerializer(serializers.ModelSerializer):
    club_id = serializers.PrimaryKeyRelatedField(
        queryset=Club.objects.all(),
        source='club'
    )

    class Meta:
        model = UserProfile
        fields = ['club_id']
