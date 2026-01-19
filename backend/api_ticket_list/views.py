from rest_framework.generics import ListAPIView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from rest_framework import status
from django.shortcuts import get_object_or_404
from models.models import Ticket, ClubRelation, Status, Notification
from .serializers import AdminPendingTicketSerializer
from django.contrib.auth.models import User
from django.db.models import Q

class PendingTicketsList(ListAPIView):
    """
    Zwraca listę wszystkich oczekujących zgłoszeń (tylko dla Admina).
    """
    serializer_class = AdminPendingTicketSerializer
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        return Ticket.objects.filter(status=Status.PENDING).order_by('-created_at')


class TicketActionView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request, pk):
        """
        Oczekuje JSON: { "action": "approve" } lub { "action": "reject" }
        """
        ticket = get_object_or_404(Ticket, pk=pk)
        action = request.data.get('action')

        notifications = []

        users = User.objects.filter(
            Q(profile__club__in=[ticket.club_a, ticket.club_b]) |
            Q(id=ticket.user.id)
        ).distinct()

        if action == 'reject':
            ticket.status = Status.REJECTED
            ticket.save()

            # Utworzenie powiadomienia dla usera, któy stworzył ticketa (odrzucone)

            for user in users:
                notifications.append(
                    Notification(
                        user=user,
                        content=(
                            f"Relacja między {ticket.club_a} a {ticket.club_b} "
                            f"została odrzucona przez administratora."
                        )
                    )
                )

            Notification.objects.bulk_create(notifications)

            return Response({"message": "Zgłoszenie odrzucone"}, status=status.HTTP_200_OK)

        elif action == 'approve':
            # Aktualizacja relacji w bazie
            c1, c2 = ticket.club_a, ticket.club_b
            
            # Sortowanie ID
            if c1.id > c2.id:
                c1, c2 = c2, c1
            
            # Zapisz "kosa", "zgoda" lub "neutralnie"
            ClubRelation.objects.update_or_create(
                club_a=c1,
                club_b=c2,
                defaults={'relation_type': ticket.relation}
            )

            # Zmiana statusu ticketa
            ticket.status = Status.APPROVED
            ticket.save()

            # Utworzenie powiadomienia (zatwierdzone)

            for user in users:
                notifications.append(
                    Notification(
                        user=user,
                        content=(
                            f"Relacja między {ticket.club_a} a {ticket.club_b} "
                            f"została zaakceptowana przez administratora."
                        )
                    )
                )

            Notification.objects.bulk_create(notifications)

            return Response({"message": "Zgłoszenie zatwierdzone"}, status=status.HTTP_200_OK)

        return Response({"error": "Nieznana akcja"}, status=status.HTTP_400_BAD_REQUEST)