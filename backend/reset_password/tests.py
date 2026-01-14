from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.core import mail
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.contrib.auth.tokens import default_token_generator


class PasswordResetTests(APITestCase):

    def setUp(self):
        self.user_email = "testuser@example.com"
        self.user_password = "initialPassword123"
        self.user = User.objects.create_user(
            username="testuser",
            email=self.user_email,
            password=self.user_password
        )

    def test_password_reset_request_existing_email_sends_email(self):
        url = reverse("password_reset_request") 
        response = self.client.post(url, {"email": self.user_email})
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("message", response.data)
        # sprawdzamy, że mail został wysłany
        self.assertEqual(len(mail.outbox), 1)
        self.assertIn("Kliknij link aby zresetować hasło", mail.outbox[0].body)
        self.assertIn(self.user_email, mail.outbox[0].to)

    def test_password_reset_request_non_existing_email_does_not_fail(self):
        url = reverse("password_reset_request")
        response = self.client.post(url, {"email": "nonexistent@example.com"})
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("message", response.data)
        # mail nie został wysłany
        self.assertEqual(len(mail.outbox), 0)

    def test_password_reset_confirm_valid_token_resets_password(self):
        uid = urlsafe_base64_encode(force_bytes(self.user.pk))
        token = default_token_generator.make_token(self.user)
        new_password = "NewStrongPassword123"

        url = reverse("password_reset_confirm")
        response = self.client.post(url, {"uid": uid, "token": token, "password": new_password})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("message", response.data)
        # odświeżamy obiekt użytkownika z bazy
        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password(new_password))

    def test_password_reset_confirm_invalid_token_returns_error(self):
        uid = urlsafe_base64_encode(force_bytes(self.user.pk))
        token = "invalid-token"
        new_password = "NewPassword123"

        url = reverse("password_reset_confirm")
        response = self.client.post(url, {"uid": uid, "token": token, "password": new_password})

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("error", response.data)

    def test_password_reset_confirm_invalid_uid_returns_error(self):
        uid = "invalid-uid"
        token = default_token_generator.make_token(self.user)
        new_password = "NewPassword123"

        url = reverse("password_reset_confirm")
        response = self.client.post(url, {"uid": uid, "token": token, "password": new_password})

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("error", response.data)
