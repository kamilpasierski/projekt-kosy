from django.test import TestCase
from django.contrib.auth import get_user_model
from models.models import Club, ClubRelation, Ticket 

User = get_user_model()

class ClubRelationLogicTest(TestCase):

    def setUp(self):

        self.user = User.objects.create_user(username='kibic', password='password123')
        

        self.club1 = Club.objects.create(name="Legia", id=1)
        self.club2 = Club.objects.create(name="Lech", id=2)

    def test_relation_ordering(self):
        """Sprawdza czy system sam sortuje kluby po ID"""

        relation = ClubRelation.objects.create(
            club_a=self.club2, 
            club_b=self.club1, 
            relation_type='kosa'
        )
        
        self.assertEqual(relation.club_a.id, 1)
        self.assertEqual(relation.club_b.id, 2)
        print("\n✅ Test sortowania relacji zaliczony!")

    def test_ticket_validation(self):
        """Sprawdza czy Ticket krzyczy błędem, gdy nie ma relacji"""
        ticket = Ticket(
            user=self.user,
            club_a=self.club1,
            club_b=self.club2,
            description="Brak zgody"
        )

        with self.assertRaises(ValueError):
            ticket.save()
        print("\n✅ Test walidacji biletu (brak relacji) zaliczony!")

    def test_ticket_success(self):
        """Sprawdza czy można stworzyć bilet, gdy relacja istnieje"""
        ClubRelation.objects.create(
            club_a=self.club1, 
            club_b=self.club2, 
            relation_type='zgoda'
        )
        
        ticket = Ticket.objects.create(
            user=self.user,
            club_a=self.club1,
            club_b=self.club2
        )
        
        self.assertEqual(ticket.relation, 'zgoda')
        print("\n✅ Test poprawnego tworzenia biletu zaliczony!")