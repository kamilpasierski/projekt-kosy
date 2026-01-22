from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from models.models import Club, FavoriteClub

User = get_user_model()

class WatchedClubsTest(APITestCase):
    """
    Testuje endpointy:
    POST /api/add_fav/watched_clubs (Dodawanie)
    DELETE /api/add_fav/watched_clubs/<pk>/ (Usuwanie)
    """

    def setUp(self):

        self.user = User.objects.create_user(username='kibic', password='password123')

        self.club_1 = Club.objects.create(name="Real", city="Madryt", id=1)
        self.club_2 = Club.objects.create(name="Barca", city="Barcelona", id=2)

        self.list_url = '/api/add_fav/watched_clubs'

    def test_add_watched_club(self):
        """Sprawdza czy można dodać klub do obserwowanych"""
        self.client.force_authenticate(user=self.user)
        
        
        data = {"club": self.club_1.id}
        
        response = self.client.post(self.list_url, data)
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        self.assertTrue(FavoriteClub.objects.filter(user=self.user, club=self.club_1).exists())

    def test_cannot_add_duplicate(self):
        """Sprawdza czy system blokuje dodanie tego samego klubu dwa razy"""
        self.client.force_authenticate(user=self.user)

        FavoriteClub.objects.create(user=self.user, club=self.club_1)

        data = {"club": self.club_1.id}
        response = self.client.post(self.list_url, data)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_remove_watched_club(self):
        """Sprawdza czy można usunąć klub z obserwowanych"""
        self.client.force_authenticate(user=self.user)

        fav_entry = FavoriteClub.objects.create(user=self.user, club=self.club_2)

        delete_url = f'/api/add_fav/watched_clubs/{fav_entry.id}/'
        
        response = self.client.delete(delete_url)
        
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

        self.assertFalse(FavoriteClub.objects.filter(pk=fav_entry.id).exists())

