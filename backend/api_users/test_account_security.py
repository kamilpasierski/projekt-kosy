from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model

User = get_user_model()

class AccountSecurityTest(APITestCase):
    """
    Testuje:
    1. Zmianę hasła.
    2. Usuwanie konta (poprawiony URL).
    """

    def setUp(self):
        self.user = User.objects.create_user(username='tester', password='OldPassword123!')

        self.change_pass_url = '/api/users/change-password/'
        self.delete_acc_url = '/api/users/me/delete/'
                          
    def test_change_password_success(self):
        """Użytkownik zmienia hasło podając poprawne stare hasło"""
        self.client.force_authenticate(user=self.user)
        
        payload = {
            "old_password": "OldPassword123!",
            "new_password": "NewPassword789!"
        }
        
        response = self.client.patch(self.change_pass_url, payload)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password("NewPassword789!"))

    def test_change_password_wrong_old(self):
        """Próba zmiany hasła z błędnym starym hasłem"""
        self.client.force_authenticate(user=self.user)
        
        payload = {
            "old_password": "WrongPassword!!!",
            "new_password": "NewPassword789!"
        }
        
        response = self.client.patch(self.change_pass_url, payload)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_delete_account(self):
        """Użytkownik usuwa swoje konto"""
        self.client.force_authenticate(user=self.user)

        self.assertEqual(User.objects.count(), 1)

        response = self.client.delete(self.delete_acc_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.assertEqual(User.objects.count(), 0)
