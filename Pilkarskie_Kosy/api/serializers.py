from rest_framework import serializers
from test_data.models import Item

class ItemSerializer(serializers.ModelSerializer)
    class Meta:
        model = Item
        fields = '__all__'