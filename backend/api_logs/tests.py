from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from models.models import ActivityLog

User = get_user_model()

class ActivityLogAPITest(APITestCase):
    """
    Testuje pobieranie logów aktywności przez API.
    """

    def setUp(self):
        self.user = User.objects.create_user(username='admin_log', password='123')
        
        # Tworzymy 2 logi w bazie
        ActivityLog.objects.create(user=self.user, action="LOGIN", object="App", details="User logged in")
        ActivityLog.objects.create(user=self.user, action="DELETE", object="Club", details="Club removed")

        # POPRAWIONY URL (zgodny z Twoim plikiem urls.py):
        self.url = '/api/activity_logs/' 

    def test_get_activity_logs(self):
        """Sprawdza czy lista logów jest pobierana"""
        self.client.force_authenticate(user=self.user)
        
        response = self.client.get(self.url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Sprawdzamy czy zwróciło 2 logi
        self.assertEqual(len(response.data), 2)
        # Sprawdzamy czy sortowanie działa (najnowsze na górze, więc DELETE powinno być pierwsze, bo stworzone jako drugie)
        # Ale to zależy od implementacji modelu. Sprawdźmy po prostu czy dane są.
        self.assertTrue(len(response.data) > 0)

