from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from models.models import Club, UserProfile, FavoriteClub, ActivityLog

User = get_user_model()

class AddFavCoverageTest(APITestCase):
    """
    Testuje brakujące ścieżki w api_add_fav/views.py:
    1. Ustawianie głównego klubu profilu (SetUserClubView).
    2. Wyciszanie ulubionych klubów (PATCH mute).
    """

    def setUp(self):
        self.user = User.objects.create_user(username='gap_tester', password='123')
        self.club = Club.objects.create(name="Main Club", city="Warsaw")
        self.fav_club = Club.objects.create(name="Fav Club", city="Poznan")

        self.client.force_authenticate(user=self.user)

        self.profile_url = '/api/add_fav/'
        self.watched_base = '/api/add_fav/watched_clubs/'

    def test_set_main_profile_club(self):
        """Testuje SetUserClubView (POST): Ustawienie głównego klubu"""
        payload = {
            "club_id": self.club.id
        }
        
        response = self.client.post(self.profile_url, payload)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        profile = UserProfile.objects.get(user=self.user)
        self.assertEqual(profile.club, self.club)

        self.assertTrue(ActivityLog.objects.filter(user=self.user, action="ADD_FAVORITE").exists())

    def test_get_main_profile_club(self):
        """Testuje SetUserClubView (GET): Pobranie info o profilu"""
        UserProfile.objects.update_or_create(
            user=self.user, 
            defaults={'club': self.club}
        )
        
        response = self.client.get(self.profile_url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['club_id'], self.club.id)

    def test_mute_watched_club(self):
        """Testuje AddFavoriteClubAPIView (PATCH): Wyciszanie klubu"""
        favorite = FavoriteClub.objects.create(user=self.user, club=self.fav_club, mute=False)
        
        url = f"{self.watched_base}{favorite.id}/"
        

        payload = {"mute": True}
        response = self.client.patch(url, payload)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        

        favorite.refresh_from_db()
        self.assertTrue(favorite.mute)
        

        self.assertTrue(ActivityLog.objects.filter(
            user=self.user, 
            action="UPDATE_FAVORITE_MUTE",
            details__contains="True"
        ).exists())

    def test_patch_fail_no_id(self):
        """Sprawdza błąd 404 przy błędnym ID w PATCH"""
        url = f"{self.watched_base}9999/"
        payload = {"mute": True}
        response = self.client.patch(url, payload)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

