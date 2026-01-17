# views.py
from rest_framework import generics
from models.models import Area
from .serializers import TerritorySerializer

class AreaListView(generics.ListAPIView):
    queryset = Area.objects.all()
    serializer_class = TerritorySerializer