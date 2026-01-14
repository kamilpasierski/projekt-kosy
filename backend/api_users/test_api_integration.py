from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from models.models import Club, ClubRelation, Ticket

User = get_user_model()

class ApiIntegrationTests(APITestCase):
    """
    Integration tests for user-facing API endpoints.
    Testuje realne ścieżki zdefiniowane w Pilkarskie_Kosy/urls.py
    """

    def setUp(self):
        self.user = User.objects.create_user(username='api_tester', password='password123')
        self.client.force_authenticate(user=self.user)

        
        self.club_a = Club.objects.create(name="Rakow Czestochowa", id=1, city="Czestochowa", desc="Mistrz")
        self.club_b = Club.objects.create(name="Radomiak Radom", id=2, city="Radom", desc="Srodek")

        
        ClubRelation.objects.create(
            club_a=self.club_a,
            club_b=self.club_b,
            relation_type='neutralnie'
        )

    def test_club_autocomplete_returns_results(self):
        url = '/clubs/autocomplete/'
        query_params = {'q': 'Rak'}
        
        response = self.client.get(url, query_params)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(len(response.data) > 0)
        
        self.assertIn('Rakow Czestochowa', str(response.data))

    def test_create_ticket_endpoint(self):
        url = '/api/ticketcreate/'
        
       
        payload = {
            'club_a': self.club_a.name,   
            'club_b': self.club_b.name,   
            'description': 'Integration test match',
            'relation': 'neutralnie'      
        }

        response = self.client.post(url, payload)

        
        if response.status_code == 400:
            print(f"\n❌ Błąd walidacji: {response.data}")

        self.assertIn(response.status_code, [status.HTTP_200_OK, status.HTTP_201_CREATED])
        self.assertTrue(Ticket.objects.filter(description='Integration test match').exists())

    def test_update_username_endpoint(self):
        url = '/api/users/me/'
        new_username = "UpdatedTester"
        payload = {'username': new_username}

        response = self.client.patch(url, payload)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertEqual(self.user.username, new_username)
