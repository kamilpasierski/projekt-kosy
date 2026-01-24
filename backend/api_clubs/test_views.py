from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from models.models import Club, UserProfile

User = get_user_model()

class ClubViewsTest(APITestCase):
    """
    Testuje pełne API klubów (api_clubs).
    """

    def setUp(self):
        self.user = User.objects.create_user(username='club_tester', password='123')
        
        self.legia = Club.objects.create(name="Legia Warszawa", city="Warszawa")
        
        for i in range(12):
            Club.objects.create(name=f"Klub {i}", city=f"Miasto {i}")

        self.all_url = '/api/clubs/all/'
        self.search_url = '/api/clubs/search/'
        self.detail_url = f'/api/clubs/{self.legia.id}/'
        self.user_club_url = '/api/clubs/user/'

    def test_public_all_clubs(self):
        self.client.logout()
        response = self.client.get(self.all_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 13)

    def test_search_and_pagination(self):
        self.client.force_authenticate(user=self.user)
        
        response = self.client.get(self.search_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 10)
        
        search_response = self.client.get(f"{self.search_url}?search=Legia")
        self.assertEqual(search_response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(search_response.data['results']), 1)
        self.assertEqual(search_response.data['results'][0]['name'], "Legia Warszawa")

    def test_club_detail(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], "Legia Warszawa")

    def test_set_user_club_via_clubs_api(self):
        """Sprawdza endpoint /user/ (Ustawianie klubu profilu)"""
        self.client.force_authenticate(user=self.user)

        payload = {"club": self.legia.id}
        
        response = self.client.post(self.user_club_url, payload)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        profile = UserProfile.objects.get(user=self.user)
        self.assertEqual(profile.club, self.legia)
