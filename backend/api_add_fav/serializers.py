from rest_framework import serializers
from models.models import UserProfile, Club, FavoriteClub

class UserClubSerializer(serializers.ModelSerializer):
    club_id = serializers.PrimaryKeyRelatedField(
        queryset=Club.objects.all(),
        source='club'
    )

    class Meta:
        model = UserProfile
        fields = ['club_id']

class FavoriteClubSerializer(serializers.ModelSerializer):
    class Meta:
        model = FavoriteClub
        fields = ['id', 'club']

    def create(self, validated_data):
        user = self.context['request'].user
        return FavoriteClub.objects.create(user=user, **validated_data)
