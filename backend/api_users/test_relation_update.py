from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from models.models import Club, ClubRelation, Ticket, Status

User = get_user_model()

class RelationUpdateEndpointTest(APITestCase):
    """
    Testuje endpoint: /api/relations/update/
    Cel: Sprawdzić ręczną edycję relacji przez Admina i automatyczne zamykanie biletów.
    """

    def setUp(self):
        
        self.admin = User.objects.create_superuser(username='admin', password='password123')
        self.user = User.objects.create_user(username='seba', password='password123')

       
        self.c1 = Club.objects.create(name="Arka", city="Gdynia", id=10, desc="A")
        self.c2 = Club.objects.create(name="Lechia", city="Gdansk", id=20, desc="L")

      
        self.ticket = Ticket.objects.create(
            user=self.user,
            club_a=self.c1,
            club_b=self.c2,
            relation='kosa',
            status=Status.PENDING
        )

        self.url = '/api/relations/update/'

    def test_regular_user_cannot_update_relation(self):
        """Seba nie może zmienić relacji"""
        self.client.force_authenticate(user=self.user)
        
        payload = {
            "club_a": "Arka",
            "club_b": "Lechia",
            "relation": "zgoda"
        }
        response = self.client.post(self.url, payload)
        
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        
        self.assertFalse(ClubRelation.objects.exists())

    def test_admin_update_resolves_tickets(self):
        """
        Admin ustawia relację ręcznie.
        Oczekujemy:
        1. Powstania relacji w bazie.
        2. Automatycznego zatwierdzenia wiszącego biletu (cleanup).
        """
        self.client.force_authenticate(user=self.admin)
        
        payload = {
            "club_a": "Arka",
            "club_b": "Lechia",
            "relation": "kosa"
        }
        response = self.client.post(self.url, payload)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], 'success')
        
        self.assertTrue(ClubRelation.objects.filter(
            club_a=self.c1, 
            club_b=self.c2, 
            relation_type='kosa'
        ).exists())

        self.ticket.refresh_from_db()
        self.assertEqual(self.ticket.status, Status.APPROVED)

