from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from models.models import Club, ClubRelation

User = get_user_model()

class DashboardFeaturesTest(APITestCase):
    """
    Testuje endpointy widoczne na stronie głównej i w panelu admina.
    Pokrywa: api_clubs_popular, api_stats (global + max-beefs)
    """

    def setUp(self):
        
        self.user = User.objects.create_user(username='seba', password='password123')
        self.admin = User.objects.create_superuser(username='admin', password='admin123')
        
        
        self.c1 = Club.objects.create(name="Real Madryt", id=1, city="Madryt", desc="Krolewscy")
        self.c2 = Club.objects.create(name="FC Barcelona", id=2, city="Barcelona", desc="Duma Katalonii")
        
        
        ClubRelation.objects.create(club_a=self.c1, club_b=self.c2, relation_type='kosa')

    def test_popular_clubs_endpoint(self):
        """Sprawdza, czy endpoint popularnych klubów działa"""
        url = '/api/clubs/popular/' 
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(isinstance(response.data, list))
        print("\n✅ Popularne Kluby API działa!")

    def test_global_stats_security(self):
        """
        Testuje zabezpieczenia statystyk globalnych (/api/stats/global/).
        Tylko ADMIN powinien mieć dostęp.
        """
        url = '/api/stats/global/'

        
        self.client.force_authenticate(user=self.user)
        response = self.client.get(url)
        
        
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        
        
        self.client.force_authenticate(user=self.admin)
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        self.assertIn('users', response.data)
        self.assertIn('tickets', response.data)
        print("\n✅ Globalne Statystyki (Security check) zaliczone!")

    def test_max_beefs_public_access(self):
        """
        Testuje endpoint /api/stats/max-beefs/
        Powinien być dostępny publicznie i zwracać kluby z kosami.
        """
        url = '/api/stats/max-beefs/'
        
        
        self.client.logout()
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(len(response.data) > 0)
    
        print("\n✅ Max Beefs (Top Kosy) działa publicznie!")

