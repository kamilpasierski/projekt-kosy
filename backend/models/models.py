from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone

User = get_user_model()

class Area(models.Model):
    name = models.CharField(max_length=100)
    polygon = models.JSONField(null=True, blank=True)

    def __str__(self):
        return self.name


class Club(models.Model):
    name = models.CharField(max_length=100, unique=True)
    city = models.CharField(max_length=30)
    points = models.IntegerField(default=0)
    desc = models.TextField()
    path_image = models.ImageField(null=True, blank=True)

    area = models.OneToOneField(
        Area,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="club"
    )

    def __str__(self):
        return self.name

class Notification(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='notifications'
    )
    content = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    muting = models.BooleanField(default=False)

class UserProfile(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='profile'
    )
    club = models.ForeignKey(
        Club,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

class ClubRelation(models.Model):
    RELATION_TYPES = [
        ('zgoda', 'Zgoda'),
        ('neutralnie', 'Neutralnie'),
        ('kosa', 'Kosa'),
    ]

    club_a = models.ForeignKey(Club, on_delete=models.CASCADE, related_name='relations_a')
    club_b = models.ForeignKey(Club, on_delete=models.CASCADE, related_name='relations_b')
    relation_type = models.CharField(max_length=20, choices=RELATION_TYPES)

    class Meta:
        # Zapobiega duplikatom: nie będzie (A-B) i (B-A) osobno
        constraints = [
            models.UniqueConstraint(
                fields=['club_a', 'club_b'],
                name='unique_club_relation'
            ),
            models.CheckConstraint(
                check=~models.Q(club_a=models.F('club_b')),
                name='no_self_relation'
            )
        ]

    def save(self, *args, **kwargs):
        # Wymuszamy kolejność klubów alfabetycznie po ID (lub name)
        if self.club_a.id > self.club_b.id:
            self.club_a, self.club_b = self.club_b, self.club_a
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.club_a.name} ↔ {self.club_b.name} : {self.relation_type}"

class FavoriteClub(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='favorite_clubs')
    club = models.ForeignKey(Club, on_delete=models.CASCADE, related_name='favorited_by')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'club')

    def __str__(self):
        return f"{self.user.username} ❤️ {self.club.name}"

class Status(models.TextChoices):
    APPROVED = 'APPROVED', 'Approved'
    PENDING = 'PENDING', 'Pending'
    REJECTED = 'REJECTED', 'Rejected'

class Ticket(models.Model):
    RELATION_TYPES = [
        ('zgoda', 'Zgoda'),
        ('neutralnie', 'Neutralnie'),
        ('kosa', 'Kosa'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="tickets")
    club_a = models.ForeignKey(Club, on_delete=models.CASCADE, related_name="tickets_a")
    club_b = models.ForeignKey(Club, on_delete=models.CASCADE, related_name="tickets_b")
    relation = models.CharField(max_length=20, choices=RELATION_TYPES)

    status = models.CharField(
        max_length=8,
        choices=Status.choices,
        default=Status.PENDING
    )

    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            # Nie można wystawić biletu dla tego samego klubu
            models.CheckConstraint(
                check=~models.Q(club_a=models.F("club_b")),
                name="no_self_ticket"
            ),
            # Każdy user może mieć jeden ticket na dane spotkanie klubów
            models.UniqueConstraint(
                fields=["user", "club_a", "club_b"],
                name="unique_ticket_per_user"
            )
        ]

    def save(self, *args, **kwargs):
        if self.club_a.id > self.club_b.id:
            self.club_a, self.club_b = self.club_b, self.club_a       
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Ticket: {self.user.username} – {self.club_a.name} vs {self.club_b.name} [{self.relation}]"