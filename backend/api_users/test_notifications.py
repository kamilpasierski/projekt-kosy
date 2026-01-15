from django.test import TestCase
from django.contrib.auth import get_user_model
from models.models import Notification

User = get_user_model()

class NotificationLogicTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='powiadomiony', password='password123')

    def test_create_notification(self):
        """Sprawdza czy można stworzyć powiadomienie dla użytkownika"""
       
        note = Notification.objects.create(
            user=self.user,
            content="Twój klub ma nową kosę z Legią."
        )

        
        self.assertEqual(Notification.objects.count(), 1)
        self.assertEqual(note.user.username, 'powiadomiony')
        self.assertEqual(note.content, "Twój klub ma nową kosę z Legią.")
        self.assertIsNotNone(note.created_at)

    
