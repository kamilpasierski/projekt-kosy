from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from models.models import Club, Ticket, ClubRelation, Status

User = get_user_model()

class TicketActionTest(APITestCase):
    """
    Testuje endpoint: /api/tickets/<id>/action/
    Scenariusze:
    1. Admin ZATWIERDZA bilet -> Powstaje relacja w bazie + Status APPROVED.
    2. Admin ODRZUCA bilet -> Status REJECTED + Brak zmian w relacjach.
    3. Zwykły User próbuje zatwierdzić -> 403 Forbidden.
    """

    def setUp(self):
        
        self.admin = User.objects.create_superuser(username='admin', password='password123')
        self.user = User.objects.create_user(username='seba', password='password123')

        
        self.club_a = Club.objects.create(name="Legia", city="Warszawa", id=100)
        self.club_b = Club.objects.create(name="Lech", city="Poznan", id=200)

       
        self.ticket = Ticket.objects.create(
            user=self.user,
            club_a=self.club_a,
            club_b=self.club_b,
            relation='kosa',
            description="Odwieczna wojna"
        )

        self.url = f'/api/tickets/{self.ticket.id}/action/'

    def test_admin_approve_creates_relation(self):
        """Happy Path: Admin zatwierdza bilet"""
        self.client.force_authenticate(user=self.admin)
        
        
        payload = {"action": "approve"}
        response = self.client.post(self.url, payload)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        
        self.ticket.refresh_from_db()
        self.assertEqual(self.ticket.status, Status.APPROVED)

        
        relation_exists = ClubRelation.objects.filter(
            club_a=self.club_a, 
            club_b=self.club_b, 
            relation_type='kosa'
        ).exists()
        self.assertTrue(relation_exists, "Relacja powinna zostać utworzona w bazie!")

    def test_admin_reject_ticket(self):
        """Admin odrzuca bilet"""
        self.client.force_authenticate(user=self.admin)
        
        payload = {"action": "reject"}
        response = self.client.post(self.url, payload)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        
        self.ticket.refresh_from_db()
        self.assertEqual(self.ticket.status, Status.REJECTED)

        
        relation_exists = ClubRelation.objects.filter(club_a=self.club_a, club_b=self.club_b).exists()
        self.assertFalse(relation_exists)

    def test_regular_user_cannot_approve(self):
        """Security: Zwykły user nie może zatwierdzać"""
        self.client.force_authenticate(user=self.user)
        
        payload = {"action": "approve"}
        response = self.client.post(self.url, payload)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
