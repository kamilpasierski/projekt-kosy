from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from models.models import Club, Ticket

User = get_user_model()

class AdminTicketListTest(APITestCase):
    """
    Testuje endpoint /api/tickets/pending/
    Cel: Upewnić się, że tylko Admin widzi listę oczekujących zgłoszeń.
    """

    def setUp(self):
        
        self.regular_user = User.objects.create_user(username='seba', password='password123')
        self.admin_user = User.objects.create_superuser(username='admin', password='admin123')

        
        self.c1 = Club.objects.create(name="Wisła", city="Krakow", id=10, desc="Biala Gwiazda")
        self.c2 = Club.objects.create(name="Cracovia", city="Krakow", id=11, desc="Pasy")
        
        Ticket.objects.create(
            user=self.regular_user,
            club_a=self.c1,
            club_b=self.c2,
            relation='kosa',
            description="Derby"
        )
        
        
        self.url = '/api/tickets/pending/'

    def test_regular_user_cannot_see_list(self):
        """Zwykły user powinien dostać 403 Forbidden"""
        self.client.force_authenticate(user=self.regular_user)
        response = self.client.get(self.url)
        
        
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        

    def test_admin_can_see_list(self):
        """Admin powinien widzieć listę biletów"""
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.get(self.url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        
        if isinstance(response.data, dict) and 'results' in response.data:
            data_list = response.data['results']
        else:
            data_list = response.data
            
        self.assertTrue(len(data_list) > 0)
        
