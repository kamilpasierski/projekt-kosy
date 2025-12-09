from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status


class EmailRegistrationTests(APITestCase):

    def setUp(self):
        # Konto utworzone wcześniej przez Google (email already exists)
        self.google_email = "test@example.com"
        User.objects.create(
            username="google_user",
            email=self.google_email,
            password="dummyPassword123!"
        )

    def test_email_registration_fails_if_user_exists_from_google(self):
        """
        Jeśli użytkownik ma konto utworzone przez Google (czyli istnieje już User z email),
        rejestracja przez email powinna zostać zablokowana.
        """

        url = reverse("register_post")  # Twój endpoint register_user

        payload = {
            "username": "newuser",
            "email": self.google_email,
            "password": "SomePassword123!",
            "re_password": "SomePassword123!"
        }

        response = self.client.post(url, payload, format='json')

        # Backend powinien odrzucić rejestrację (status 400)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        # Oczekujemy komunikatu o tym, że email już istnieje
        self.assertIn("email", response.data)
        self.assertEqual(
            response.data["email"][0], 
            "Email jest już zajęty."
        )
