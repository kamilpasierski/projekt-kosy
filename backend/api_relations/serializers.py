from rest_framework import serializers
from models.models import ClubRelation

# --- DLA MAPY (GET) ---
class RelationListSerializer(serializers.ModelSerializer):
    club_a_name = serializers.CharField(source='club_a.name', read_only=True)
    club_b_name = serializers.CharField(source='club_b.name', read_only=True)

    class Meta:
        model = ClubRelation
        fields = ['club_a_name', 'club_b_name', 'relation_type']


# --- DLA ADMINA (POST) ---
class RelationUpdateSerializer(serializers.Serializer):
    club_a = serializers.CharField()
    club_b = serializers.CharField()
    relation = serializers.CharField()