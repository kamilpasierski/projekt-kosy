from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from django.contrib.auth.models import User
from models.models import Club, ClubRelation, Ticket

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