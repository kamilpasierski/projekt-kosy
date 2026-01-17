from rest_framework.views import APIView
from rest_framework.response import Response
from models.models import Club
from .serializers import ClubSerializer


class AllClubsView(APIView):
    def get(self, request):
        clubs = Club.objects.order_by('name')
        serializer = ClubSerializer(clubs, many=True)
        return Response(serializer.data)
