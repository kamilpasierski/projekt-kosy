from django.test import TestCase
from django.contrib.auth import get_user_model
from models.models import FavoriteClub, Club, ActivityLog

User = get_user_model()

class NewFeaturesModelTest(TestCase):
    """
    Testuje nowe zmiany w bazie danych:
    1. Pole 'mute' w FavoriteClub.
    2. Model ActivityLog.
    """

    def setUp(self):
        self.user = User.objects.create_user(username='log_tester', password='123')
        self.club = Club.objects.create(name="Test Club", city="City")

    def test_favorite_club_mute_field(self):
        """Sprawdza, czy pole 'mute' domyślnie jest False i czy można je zmienić"""
        # Tworzymy ulubiony klub
        fav = FavoriteClub.objects.create(user=self.user, club=self.club)
        
        # Domyślnie powinno być False
        self.assertFalse(fav.mute)
        
        # Zmieniamy na True (wyciszenie)
        fav.mute = True
        fav.save()
        
        # Sprawdzamy czy się zapisało
        fav.refresh_from_db()
        self.assertTrue(fav.mute)

    def test_activity_log_creation(self):
        """Sprawdza, czy można poprawnie zapisać log aktywności"""
        log = ActivityLog.objects.create(
            user=self.user,
            action="LOGIN",
            object="User Session",
            details="User logged in via IP 127.0.0.1"
        )
        
        self.assertEqual(ActivityLog.objects.count(), 1)
        self.assertEqual(log.user.username, 'log_tester')
        self.assertEqual(log.action, "LOGIN")

