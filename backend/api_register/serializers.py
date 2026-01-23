from rest_framework import serializers
from django.contrib.auth.models import User
from models.models import Club


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    re_password = serializers.CharField(write_only=True)
    club_id = serializers.IntegerField(required=False, allow_null=True, write_only=True)

    class Meta:
        model = User
        fields = ['username', 'password', 're_password', 'email', 'club_id']

    """
    Password requirements:
        - Length: 8 characters
        - Upper: 1 character
        - Digits: 1 character
        - Special signs: 1 character
    """

    def validate(self, data):
        errors = {}

        # Sprawdzenie czy email już istnieje
        if User.objects.filter(email=data.get('email')).exists():
            errors['email'] = "Email jest już zajęty."

        # Sprawdzenie dopasowania haseł
        if data.get('password') != data.get('re_password'):
            errors['re_password'] = "Hasła nie są takie same."

        password = data.get('password', '')
        password_errors = []

        if len(password) < 8:
            password_errors.append("Hasło musi składać się przynajmniej z 8 znaków.")
        if not any(char.isupper() for char in password):
            password_errors.append("Hasło musi zawierać dużą literę.")
        if not any(char.isdigit() for char in password):
            password_errors.append("Hasło musi zawierać liczbę.")
        if password.isalnum():
            password_errors.append("Hasło musi zawierać znak specjalny.")

        if password_errors:
            errors['password'] = " ".join(password_errors)

        if errors:
            raise serializers.ValidationError(errors)

        return data  # NIE usuwaj re_password ani email

    def create(self, validated_data):
        validated_data.pop('re_password', None)  # usuń re_password tylko tutaj
        club_id = validated_data.pop('club_id', None)  # pobierz i usuń club_id
        email = validated_data.get('email')  # bezpieczne pobranie email
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password'],
            email=email,
            is_active=False
        )
        
        # Ustaw club_id w profilu użytkownika (jeśli podano)
        if club_id:
            try:
                club = Club.objects.get(id=club_id)
                user.profile.club = club
                user.profile.save()
            except Club.DoesNotExist:
                pass  # Ignoruj jeśli klub nie istnieje
        
        return user
