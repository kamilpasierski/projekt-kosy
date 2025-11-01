from rest_framework.test import APITestCase
from django.urls import reverse
from rest_framework import status

class UserApiTest(APITestCase):
    def test_get_users(self):
        url = reverse('get-users')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)