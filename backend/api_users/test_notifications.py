from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from models.models import Notification

User = get_user_model()

class NotificationLogicTest(APITestCase):
    """
    Testuje:
    1. Tworzenie powiadomień (przez logikę biznesową).
    2. Pobieranie listy powiadomień.
    3. Oznaczanie powiadomienia jako przeczytane (is_read).
    """

    def setUp(self):
        self.user = User.objects.create_user(username='seba', password='password123')
        
        self.notification = Notification.objects.create(
            user=self.user,
            content="Twoja kosa została zaakceptowana",
            is_read=False
        )

        self.read_url = f'/api/tickets/notifications/{self.notification.id}/read/'

    def test_mark_notification_as_read(self):
        """Sprawdza czy PATCH zmienia status na True"""
        self.client.force_authenticate(user=self.user)

        response = self.client.patch(self.read_url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.notification.refresh_from_db()
        self.assertTrue(self.notification.is_read, "Powiadomienie powinno mieć status is_read=True")

    def test_cannot_mark_others_notification(self):
        """Security: User nie może odznaczyć powiadomienia innej osoby"""
        other_user = User.objects.create_user(username='hacker', password='password123')
        self.client.force_authenticate(user=other_user)

        response = self.client.patch(self.read_url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

