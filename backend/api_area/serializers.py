from rest_framework import serializers
from models.models import Area
import json

class TerritorySerializer(serializers.ModelSerializer):
    owner_name = serializers.CharField(source='club.name', read_only=True, allow_null=True)
    
    class Meta:
        model = Area
        fields = ['id', 'polygon', 'owner_name']

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        
        # Parsowanie pola polygon, jeśli w bazie jest stringiem
        if isinstance(instance.polygon, str):
            try:
                ret['polygon'] = json.loads(instance.polygon)
            except (ValueError, TypeError):
                ret['polygon'] = []  # Fallback w razie błędu parsowania
        
        return ret