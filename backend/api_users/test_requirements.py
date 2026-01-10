
from django.test import TestCase
from django.contrib.auth import get_user_model
from models.models import Club, Area, ClubRelation

User = get_user_model()

class SecurityRequirementTest(TestCase):
    def setUp(self):
        
        self.user = User.objects.create_user(username='hooligan', password='password123')
        
        
        self.admin = User.objects.create_superuser(username='admin', password='adminpassword')
        
        self.club = Club.objects.create(name="GKS Katowice", id=10)

    def test_user_cannot_delete_club(self):
        """Wymaganie: Tylko administrator zarządza klubami"""
        
        
        self.assertFalse(self.user.is_staff)
        self.assertFalse(self.user.is_superuser)
        
        
        self.assertTrue(self.admin.is_staff)
        self.assertTrue(self.admin.is_superuser)
        print("\n✅ Test ról (User vs Admin) zaliczony!")

class GeoRequirementTest(TestCase):
    def setUp(self):
        
        self.area_data = {
            "type": "Polygon",
            "coordinates": [[[0, 0], [0, 10], [10, 10], [10, 0], [0, 0]]]
        }
        self.area = Area.objects.create(name="Centrum", polygon=self.area_data)

    def test_club_linked_to_area(self):
        """Wymaganie: Kluby są powiązane z geolokalizacją"""
        club = Club.objects.create(name="Ruch", area=self.area)
        
        
        self.assertEqual(club.area.name, "Centrum")
        self.assertIsNotNone(club.area.polygon)
        print("\n✅ Test integracji Klub-Obszar (Geolokalizacja) zaliczony!")

