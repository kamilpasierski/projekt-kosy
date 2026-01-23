from rest_framework import serializers
from models.models import ActivityLog


class ActivityLogSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()

    class Meta:
        model = ActivityLog
        fields = [
            "id",
            "created_at",
            "user",
            "action",
            "object",
            "details",
        ]
