from rest_framework import serializers
from ..models.models import Ticket, Club

class TicketCreateSerializer(serializers.ModelSerializer):
    club_a = serializers.SlugRelatedField(
        slug_field="name",
        queryset=Club.objects.all()
    )
    club_b = serializers.SlugRelatedField(
        slug_field="name",
        queryset=Club.objects.all()
    )

    class Meta:
        model = Ticket
        fields = [
            "club_a",
            "club_b",
            "description",
            "relation"
        ]

    def validate(self, attrs):
        if attrs["club_a"] == attrs["club_b"]:
            raise serializers.ValidationError(
                "Nie można stworzyć ticketu dla tego samego klubu."
            )
        return attrs
