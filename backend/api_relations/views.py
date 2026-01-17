from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser, AllowAny
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.db.models import Q
from models.models import Club, ClubRelation, Ticket, Status
from .serializers import RelationUpdateSerializer, RelationListSerializer

# --- GET: DLA MAPY (geoUtils) ---
@api_view(['GET'])
@permission_classes([AllowAny])
def get_all_relations(request):
    relations = ClubRelation.objects.all()
    serializer = RelationListSerializer(relations, many=True)
    return Response(serializer.data)

# --- POST: DLA ADMINA ---
@api_view(['POST'])
@permission_classes([IsAdminUser])
def relation_update_view(request):
    serializer = RelationUpdateSerializer(data=request.data)
    if serializer.is_valid():
        data = serializer.validated_data
        club_a = get_object_or_404(Club, name=data['club_a'])
        club_b = get_object_or_404(Club, name=data['club_b'])

        if club_a == club_b:
            return Response({"error": "Kluby muszą być różne."}, status=400)

        if club_a.id > club_b.id:
            club_a, club_b = club_b, club_a

        obj, created = ClubRelation.objects.update_or_create(
            club_a=club_a,
            club_b=club_b,
            defaults={'relation_type': data['relation']}
        )

        Ticket.objects.filter(
            (Q(club_a=club_a) & Q(club_b=club_b)) | (Q(club_a=club_b) & Q(club_b=club_a)),
            status=Status.PENDING
        ).update(status=Status.APPROVED)

        action_msg = "utworzona" if created else "zaktualizowana"
        return Response({
            "status": "success",
            "message": f"Relacja {action_msg} jako {obj.relation_type}.",
            "relation": obj.relation_type
        }, status=200)

    return Response(serializer.errors, status=400)