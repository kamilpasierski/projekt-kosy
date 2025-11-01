from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Club(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name


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

    class Meta:
        unique_together = ('user', 'club')

    def __str__(self):
        return f"{self.user.username} ❤️ {self.club.name}"


