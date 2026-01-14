from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth.models import User

class LoginFlowTest(APITestCase):
    """
    Testuje proces logowania (uzyskiwania tokena JWT).
    Endpoint: /api/token/ (zdefiniowany w Pilkarskie_Kosy/urls.py)
    """

    def setUp(self):
        
        self.username = 'testuser'
        self.password = 'StrongPass123!'
        self.user = User.objects.create_user(username=self.username, password=self.password)
        
        
        self.url = '/api/token/'

    def test_login_success_returns_token(self):
        """Sprawdza, czy poprawne dane zwracają tokeny (access i refresh)"""
        data = {
            'username': self.username,
            'password': self.password
        }
        
        response = self.client.post(self.url, data)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)
        
    def test_login_failure_wrong_password(self):
        """Sprawdza, czy błędne hasło blokuje dostęp"""
        data = {
            'username': self.username,
            'password': 'WrongPassword'
        }
        
        response = self.client.post(self.url, data)
        
    
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
      

