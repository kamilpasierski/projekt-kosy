from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.contrib.auth.tokens import default_token_generator
from models.models import Club

User = get_user_model()

class RegisterCoverageTest(APITestCase):
    """
    Kompleksowe testy rejestracji (api_register).
    """

    def setUp(self):
        self.register_url = '/api/register/'
        self.club = Club.objects.create(name="Test Club", city="Test City")
        
        self.valid_payload = {
            "username": "newuser",
            "email": "new@test.com",
            "password": "StrongPass1!",
            "re_password": "StrongPass1!",
            "club_id": self.club.id
        }

    def test_register_success(self):
        """Happy Path"""
        response = self.client.post(self.register_url, self.valid_payload)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        user = User.objects.get(email="new@test.com")
        self.assertFalse(user.is_active)
        self.assertEqual(user.profile.club, self.club)

    def test_register_email_taken(self):
        """Błąd: Email zajęty"""
        User.objects.create_user(username="old", email="new@test.com", password="123")
        response = self.client.post(self.register_url, self.valid_payload)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("Email jest już zajęty", str(response.data))

    def test_passwords_mismatch(self):
        """Błąd: Różne hasła"""
        data = self.valid_payload.copy()
        data['re_password'] = "OtherPass1!"
        response = self.client.post(self.register_url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("Hasła nie są takie same", str(response.data))

    def test_password_complexity_checks(self):
        """Testuje warunki hasła"""
        scenarios = [
            ("short1!", "Hasło musi składać się przynajmniej z 8 znaków"),
            ("alllower1!", "Hasło musi zawierać dużą literę"),
            ("ALLUPPER1", "Hasło musi zawierać znak specjalny"),
            ("NoDigits!", "Hasło musi zawierać liczbę"),
            ("NoSpecial1", "Hasło musi zawierać znak specjalny"),
        ]

        for bad_pass, error_msg in scenarios:
            data = self.valid_payload.copy()
            data['password'] = bad_pass
            data['re_password'] = bad_pass
            
            response = self.client.post(self.register_url, data)
            
            self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST, 
                             f"Hasło '{bad_pass}' powinno zostać odrzucone")
            self.assertIn(error_msg, str(response.data))

    def test_register_invalid_club_id(self):
        """Edge Case: Złe ID klubu"""
        data = self.valid_payload.copy()
        data['club_id'] = 99999
        response = self.client.post(self.register_url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        user = User.objects.get(username="newuser")
        self.assertIsNone(user.profile.club)

    def test_activate_account_success(self):
        """Aktywacja sukces"""
        user = User.objects.create_user("inactive", "in@test.com", "Pass123", is_active=False)
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)
        
        url = f"/api/register/activate/{uid}/{token}"
        response = self.client.get(url, follow=False)
        
        self.assertEqual(response.status_code, status.HTTP_302_FOUND)
        user.refresh_from_db()
        self.assertTrue(user.is_active)

    def test_activate_invalid_uid(self):
        """Błędne UID"""
        uid = urlsafe_base64_encode(force_bytes(99999))
        url = f"/api/register/activate/{uid}/dummy-token"
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_activate_invalid_token(self):
        """Błędny token"""
        user = User.objects.create_user("hacker", "h@test.com", "Pass123")
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        url = f"/api/register/activate/{uid}/bad-token"
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
