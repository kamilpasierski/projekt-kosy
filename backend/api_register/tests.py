from django.test import TestCase
from rest_framework.exceptions import ValidationError
from .serializers import RegisterSerializer
from rest_framework.test import APITestCase
from django.urls import reverse
from rest_framework import status
from django.contrib.auth.models import User


class RegisterSerializerTest(TestCase):

    def test_passwords_not_matching(self):
        data = {
            "username": "testuser",
            "password": "Test123!",
            "re_password": "Test1234!"
        }
        serializer = RegisterSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("Hasła nie są takie same.", str(serializer.errors))

    def test_password_too_short(self):
        data = {
            "username": "testuser",
            "password": "T1!",
            "re_password": "T1!"
        }
        serializer = RegisterSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("Hasło musi składać się przynajmniej z 8 znaków", str(serializer.errors))

    def test_password_missing_uppercase(self):
        data = {
            "username": "testuser",
            "password": "test123!",
            "re_password": "test123!"
        }
        serializer = RegisterSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("Hasło musi zawierać dużą literę", str(serializer.errors))

    def test_password_missing_digit(self):
        data = {
            "username": "testuser",
            "password": "Testtest!",
            "re_password": "Testtest!"
        }
        serializer = RegisterSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("Hasło musi zawierać liczbę", str(serializer.errors))

    def test_password_missing_special_character(self):
        data = {
            "username": "testuser",
            "password": "Test1234",
            "re_password": "Test1234"
        }
        serializer = RegisterSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("Hasło musi zawierać znak specjalny", str(serializer.errors))

    def test_valid_password_creates_user(self):
        data = {
            "username": "testuser",
            "password": "Test123!",
            "re_password": "Test123!"
        }
        serializer = RegisterSerializer(data=data)
        self.assertTrue(serializer.is_valid(), serializer.errors)
        user = serializer.save()
        self.assertEqual(user.username, "testuser")


class RegisterAPITest(APITestCase):

    def setUp(self):
        self.url = reverse('register_post')

    def test_successful_registration(self):
        data = {
            "username": "newuser",
            "password": "Test123!",
            "re_password": "Test123!"
        }
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["message"], "Użytkownik został pomyślnie utworzony.")
        self.assertTrue(User.objects.filter(username="newuser").exists())

    def test_password_too_short_via_api(self):
        data = {
            "username": "tinyuser",
            "password": "T1!",
            "re_password": "T1!"
        }
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("Hasło musi składać się przynajmniej z 8 znaków", str(response.data))

    def test_passwords_not_matching(self):
        data = {
            "username": "testuser",
            "password": "Test123!",
            "re_password": "Different123!"
        }
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("Hasła nie są takie same.", str(response.data))
