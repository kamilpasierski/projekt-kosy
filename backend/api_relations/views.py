from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.db.models import Q
from models.models import Club, ClubRelation, Ticket, Status
from .serializers import RelationUpdateSerializer

@api_view(['POST'])
@permission_classes([IsAdminUser])
def relation_update_view(request):
    """
    Logika:
    - Każdy typ (Kosa, Zgoda, Neutralnie) jest zapisywany w bazie.
    - Dzięki temu odróżniamy "brak danych" (brak rekordu) od "neutralnie" (jest rekord).
    - Zamyka wiszące tickety.
    """
    serializer = RelationUpdateSerializer(data=request.data)
    
    if serializer.is_valid():
        data = serializer.validated_data
        
        # Pobieranie klubów
        club_a = get_object_or_404(Club, name=data['club_a'])
        club_b = get_object_or_404(Club, name=data['club_b'])

        if club_a == club_b:
            return Response({"error": "Kluby muszą być różne."}, status=400)

        # Sortowanie ID (kluczowe dla unikalności A-B vs B-A)
        if club_a.id > club_b.id:
            club_a, club_b = club_b, club_a

        # UNIWERSALNY ZAPIS (Update or Create)
        # Niezależnie czy to Kosa, Zgoda czy Neutralnie - zapisujemy to "na sztywno".
        obj, created = ClubRelation.objects.update_or_create(
            club_a=club_a,
            club_b=club_b,
            defaults={'relation_type': data['relation']}
        )

        # CZYSZCZENIE KOLEJKI ZGŁOSZEŃ
        updated_count = Ticket.objects.filter(
            (Q(club_a=club_a) & Q(club_b=club_b)) | (Q(club_a=club_b) & Q(club_b=club_a)),
            status=Status.PENDING
        ).update(status=Status.APPROVED)

        action_msg = "utworzona" if created else "zaktualizowana"

        return Response({
            "status": "success",
            "message": f"Relacja {action_msg} jako {obj.relation_type}.",
            "relation": obj.relation_type,
            "tickets_resolved": updated_count
        }, status=200)

    return Response(serializer.errors, status=400)