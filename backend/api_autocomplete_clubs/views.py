from rest_framework.views import APIView
from rest_framework.response import Response
from models.models import Club

class ClubAutocomplete(APIView):
    def get(self, request):
        query = request.GET.get("q", "")

        clubs = (
            Club.objects
            .filter(name__icontains=query)
            .order_by("name")[:10]
        )

        return Response([{"id": club.id, "name": club.name} for club in clubs])
