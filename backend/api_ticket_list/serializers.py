from rest_framework import serializers
from models.models import Ticket, Club
from models.models import Notification

class ClubInfoSerializer(serializers.ModelSerializer):
    logoUrl = serializers.SerializerMethodField()

    class Meta:
        model = Club
        fields = ['name', 'logoUrl']

    def get_logoUrl(self, obj):
        if hasattr(obj, 'path_image') and obj.path_image:
             return obj.path_image.url if hasattr(obj.path_image, 'url') else obj.path_image
        return ""

class AdminPendingTicketSerializer(serializers.ModelSerializer):
    clubA = ClubInfoSerializer(source='club_a', read_only=True)
    clubB = ClubInfoSerializer(source='club_b', read_only=True)
    reporter = serializers.CharField(source='user.username', read_only=True)
    
    date = serializers.DateTimeField(source='created_at', format="%d.%m.%Y, %H:%M", read_only=True)
    
    class Meta:
        model = Ticket
        fields = [
            "id", 
            "date", 
            "reporter", 
            "clubA", 
            "clubB", 
            "relation"
        ]

class NotificationSerializer(serializers.ModelSerializer):
    timestamp = serializers.DateTimeField(source='created_at', format="%d.%m.%Y, %H:%M", read_only=True)

    class Meta:
        model = Notification
        fields = ['id', 'content', 'timestamp', 'is_read']