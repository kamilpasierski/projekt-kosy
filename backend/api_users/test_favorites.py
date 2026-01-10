from django.test import TestCase
from django.db import IntegrityError
from django.contrib.auth import get_user_model
from models.models import Club, FavoriteClub

User = get_user_model()

class FavoriteClubTest(TestCase):

    def setUp(self):
        self.user = User.objects.create_user(username='fanatyk', password='password123')
        self.legia = Club.objects.create(name="Legia", id=1)
        self.widzew = Club.objects.create(name="Widzew", id=2)

    def test_add_favorite_club(self):
        """Sprawdza, czy można normalnie dodać klub do ulubionych"""
        FavoriteClub.objects.create(user=self.user, club=self.legia)
        self.assertEqual(FavoriteClub.objects.count(), 1)
        self.assertEqual(self.user.favorite_clubs.first().club.name, "Legia")

    def test_prevent_duplicate_favorites(self):
        """Sprawdza, czy baza blokuje dodanie tego samego klubu drugi raz"""
        FavoriteClub.objects.create(user=self.user, club=self.legia)
        with self.assertRaises(IntegrityError):
            FavoriteClub.objects.create(user=self.user, club=self.legia)

    def test_multiple_favorites(self):
        """Sprawdza, czy można kochać dwa różne kluby"""
        FavoriteClub.objects.create(user=self.user, club=self.legia)
        FavoriteClub.objects.create(user=self.user, club=self.widzew)
        self.assertEqual(FavoriteClub.objects.count(), 2)
