from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token


class ProfileAPITest(APITestCase):

    def setUp(self):
        
        self.user = User.objects.create_user(username='testuser', password='Test123!')
        
        self.token = Token.objects.create(user=self.user)
        
        self.url = reverse('profile')

    def test_unauthenticated_access(self):
        """
        Próba wejścia bez tokenu powinna zwrócić 401 UNAUTHORIZED.
        """
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_authenticated_access(self):
        """
        Po zalogowaniu użytkownik powinien zobaczyć swoje powitanie.
        """
        
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token.key}')

        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['message'], f"Hello, {self.user.username}!")
