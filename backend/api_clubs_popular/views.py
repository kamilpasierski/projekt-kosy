from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics
from models.models import Club
from .serializers import ClubSerializer
from .serializers_details import ClubDetailSerializer


class PopularClubsView(APIView):
    """
    Returns clubs ordered by points (descending).
    """
    def get(self, request):
        clubs = Club.objects.all().order_by('-points')[:6]
        serializer = ClubSerializer(clubs, many=True)
        return Response(serializer.data)

class ClubDetailView(generics.RetrieveAPIView):
    queryset = Club.objects.all()
    serializer_class = ClubDetailSerializer
    lookup_field = 'id'
