from rest_framework import serializers
from models.models import ClubRelation

class RelationUpdateSerializer(serializers.Serializer):
    club_a = serializers.CharField()
    club_b = serializers.CharField()
    relation = serializers.ChoiceField(choices=ClubRelation.RELATION_TYPES)
    description = serializers.CharField(required=False, allow_blank=True)