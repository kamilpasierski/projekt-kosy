from rest_framework import generics, filters
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from models.models import Club, UserProfile 
from .serializers import ClubSerializer, UserClubSerializer

# --- KONFIGURACJA PAGINACJI ---
class ClubListPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

# --- WIDOK TABELI ---
class ClubSearchListView(generics.ListAPIView): 
    queryset = Club.objects.all().order_by('name')
    serializer_class = ClubSerializer
    
    pagination_class = ClubListPagination 
    
    # Filtry
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'city']
    ordering_fields = ['name', 'city']

# --- POZOSTAŁE WIDOKI ---
class AllClubsView(APIView):
    def get(self, request):
        clubs = Club.objects.order_by('name')
        serializer = ClubSerializer(clubs, many=True)
        return Response(serializer.data)

class SetUserClubView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile, created = UserProfile.objects.get_or_create(user=request.user)
        serializer = UserClubSerializer(profile)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        profile, created = UserProfile.objects.get_or_create(user=request.user)
        serializer = UserClubSerializer(profile, data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response({"message": "OK"}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)