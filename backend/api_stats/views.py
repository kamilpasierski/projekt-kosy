from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from rest_framework import generics
from django.contrib.auth.models import User
from django.db.models import Count, Q
from models.models import Club, ClubRelation, Ticket
from .serializers import ClubBeefSerializer

class GlobalStatsView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        relations_count = ClubRelation.objects.count()
        active_clubs_count = Club.objects.count()
        users_count = User.objects.count()
        
        pending_tickets_count = Ticket.objects.filter(status='pending').count()

        data = {
            "relations": relations_count,
            "clubs": active_clubs_count,
            "users": users_count,
            "tickets": pending_tickets_count
        }

        return Response(data)

class MaxBeefsListView(generics.ListAPIView):
    serializer_class = ClubBeefSerializer
    authentication_classes = [] 
    permission_classes = []

    def get_queryset(self):
        return Club.objects.annotate(
            kos_count=Count('relations_a', filter=Q(relations_a__relation_type='kosa'), distinct=True) +
                      Count('relations_b', filter=Q(relations_b__relation_type='kosa'), distinct=True)
        ).filter(kos_count__gt=0).order_by('-kos_count')[:4]