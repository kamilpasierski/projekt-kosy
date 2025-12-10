from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from unittest.mock import patch
from rest_framework import status

User = get_user_model()

class GoogleLoginTests(APITestCase):
    def setUp(self):
        self.url = "/google/register/"
        self.user_data = {
            "token": "fake-google-token"
        }

    @patch("google_register.views.id_token.verify_oauth2_token")
    def test_google_registration_creates_active_user(self, mock_verify):
        # mock zwraca zawsze poprawne dane użytkownika
        mock_verify.return_value = {
            "email": "testgoogle@example.com",
            "given_name": "Google",
            "family_name": "User"
        }

        response = self.client.post(self.url, self.user_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Sprawdzenie, że użytkownik powstał w bazie
        user = User.objects.get(email="testgoogle@example.com")
        self.assertTrue(user.is_active)
