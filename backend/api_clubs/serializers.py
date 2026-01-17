from rest_framework import serializers
from models.models import Club, UserProfile

# Serializer dla listy klubów
class ClubSerializer(serializers.ModelSerializer):
    class Meta:
        model = Club
        fields = '__all__'

# Serializer dla ulubionego klubu
class UserClubSerializer(serializers.ModelSerializer):
    club_name = serializers.CharField(source='club.name', read_only=True, allow_null=True)
    
    class Meta:
        model = UserProfile
        fields = ['user', 'club', 'club_name']