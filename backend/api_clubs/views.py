from rest_framework import generics, filters, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.shortcuts import get_object_or_404

from models.models import Club, UserProfile
from .serializers import ClubSerializer, UserClubSerializer
from .serializers_details import ClubDetailSerializer

# --- PAGINACJA ---
class ClubListPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

# --- WYSZUKIWANIE I LISTA TABELARYCZNA ---
class ClubSearchListView(generics.ListAPIView): 
    queryset = Club.objects.all().order_by('name')
    serializer_class = ClubSerializer
    pagination_class = ClubListPagination 
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'city']
    ordering_fields = ['name', 'city']

# --- LEKKA LISTA WSZYSTKICH (Dla dropdownów / initu mapy) ---
class AllClubsView(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        clubs = Club.objects.order_by('name')
        serializer = ClubSerializer(clubs, many=True)
        return Response(serializer.data)

# --- SZCZEGÓŁY KLUBU (Przeniesione z popular!) ---
class ClubDetailView(generics.RetrieveAPIView):
    queryset = Club.objects.all()
    serializer_class = ClubDetailSerializer
    lookup_field = 'id'

# --- ULUBIONY KLUB USERA ---
class SetUserClubView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile, created = UserProfile.objects.get_or_create(user=request.user)
        
        serializer = UserClubSerializer(profile)
        return Response(serializer.data, status=status.HTTP_200_OK)

    # Metoda POST do ustawiania klubu
    def post(self, request):
        profile, created = UserProfile.objects.get_or_create(user=request.user)
        serializer = UserClubSerializer(profile, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Klub zaktualizowany"}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)