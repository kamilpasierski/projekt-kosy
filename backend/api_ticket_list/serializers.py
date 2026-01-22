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

class UserTicketSerializer(serializers.ModelSerializer):
    """Serializer for user's own tickets (all statuses)"""
    club_a = ClubInfoSerializer(read_only=True)
    club_b = ClubInfoSerializer(read_only=True)
    
    class Meta:
        model = Ticket
        fields = [
            "id",
            "created_at",
            "club_a",
            "club_b",
            "relation",
            "status",
            "description"
        ]

class NotificationSerializer(serializers.ModelSerializer):
    timestamp = serializers.DateTimeField(source='created_at', format="%d.%m.%Y, %H:%M", read_only=True)

    class Meta:
        model = Notification
        fields = ['id', 'content', 'timestamp', 'is_read']