from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
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