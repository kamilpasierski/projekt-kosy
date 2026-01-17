from rest_framework import serializers
from models.models import Club, UserProfile

# Serializer dla listy klubów
class ClubSerializer(serializers.ModelSerializer):
    class Meta:
        model = Club
        fields = '__all__'

# Serializer dla ulubionego klubu
class UserClubSerializer(serializers.ModelSerializer):
    club_id = serializers.PrimaryKeyRelatedField(
        queryset=Club.objects.all(),
        source='club',
        allow_null=True
    )

    class Meta:
        model = UserProfile
        fields = ['club_id']