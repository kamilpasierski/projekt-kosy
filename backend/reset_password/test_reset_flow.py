from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from django.core import mail
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.contrib.auth.tokens import default_token_generator

User = get_user_model()

class PasswordResetTest(APITestCase):
    """
    Testuje pełny proces resetowania hasła:
    1. Żądanie linku (wysyłka emaila).
    2. Potwierdzenie zmiany hasła (użycie tokenu).
    """

    def setUp(self):
        self.user = User.objects.create_user(username='zapominalski', email='reset@test.com', password='OldPass123')

        self.request_url = '/password-reset/'
        self.confirm_url = '/password-reset/confirm/'

    def test_request_password_reset_email(self):
        """Sprawdza, czy API wysyła email po podaniu poprawnego adresu"""
        payload = {"email": "reset@test.com"}
        
        response = self.client.post(self.request_url, payload)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.assertEqual(len(mail.outbox), 1)
        self.assertIn("Reset hasła", mail.outbox[0].subject)

    def test_confirm_password_reset_success(self):
        """Sprawdza, czy można zmienić hasło mając poprawny token i UID"""
        uid = urlsafe_base64_encode(force_bytes(self.user.pk))
        token = default_token_generator.make_token(self.user)
        new_password = "SuperNewPassword123!"

        payload = {
            "uid": uid,
            "token": token,
            "password": new_password
        }

        response = self.client.post(self.confirm_url, payload)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password(new_password))
        self.assertFalse(self.user.check_password("OldPass123"))

    def test_confirm_password_reset_invalid_token(self):
        """Sprawdza reakcję na błędny token"""
        payload = {
            "uid": "baduid",
            "token": "badtoken",
            "password": "NewPassword123"
        }
        
        response = self.client.post(self.confirm_url, payload)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

