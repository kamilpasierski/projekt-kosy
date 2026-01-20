from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import status
from django.shortcuts import get_object_or_404
from models.models import Club
from api_clubs.serializers import ClubSerializer

class PopularClubsView(APIView):
    """
    Zwraca top 6 klubów. Tylko dla Homepage.
    """
    permission_classes = [AllowAny]

    def get(self, request):
        clubs = Club.objects.all().order_by('-points')[:6]
        serializer = ClubSerializer(clubs, many=True)
        return Response(serializer.data)


class IncrementClubPointsView(APIView):
    """
    Inkrementuje punkty klubu o 1 przy każdym wyszukaniu.
    """
    permission_classes = [AllowAny]

    def post(self, request, club_id):
        club = get_object_or_404(Club, id=club_id)
        club.points += 1
        club.save(update_fields=['points'])
        return Response({"message": "Points incremented", "points": club.points}, status=status.HTTP_200_OK)