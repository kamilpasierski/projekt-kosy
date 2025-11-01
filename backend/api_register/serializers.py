from rest_framework import serializers
from django.contrib.auth.models import User


class RegisterSerializer(serializers.ModelSerializer):

    password = serializers.CharField(write_only=True)
    re_password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'password', 're_password']

    """
    
    Password requirements:
        
        - Length: 8 characters
        - Upper: 1 character
        - Digits: 1 character
        - Special signs: 1 character
    
    """

    def validate(self, data):

        print("Validate TEST")

        if data['password'] != data['re_password']:
            raise serializers.ValidationError("Hasła nie są takie same.")

        elif len(data['password']) < 8:
            raise serializers.ValidationError("Hasło musi składać się przynajmniej z 8 znaków")

        elif not any(char.isupper() for char in data['password']):
            raise serializers.ValidationError("Hasło musi zawierać dużą literę")

        elif not any(char.isdigit() for char in data['password']):
            raise serializers.ValidationError("Hasło musi zawierać liczbę")

        elif data['password'].isalnum():
            raise serializers.ValidationError("Hasło musi zawierać znak specjalny")

        data.pop('re_password')
        return data

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password']
        )
        return user
