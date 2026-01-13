from rest_framework.views import APIView
from rest_framework.response import Response
from models.models import Club
from .serializers import ClubSerializer


class PopularClubsView(APIView):
    """
    Returns clubs ordered by points (descending).
    """
    def get(self, request):
        clubs = Club.objects.all().order_by('-points')[:6]
        serializer = ClubSerializer(clubs, many=True)
        return Response(serializer.data)
