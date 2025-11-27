from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from google.oauth2 import id_token
from google.auth.transport import requests
from django.conf import settings
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()

class GoogleLoginAPIView(APIView):
    def post(self, request):
        token = request.data.get("token")

        if not token:
            return Response({"error": "Brak tokenu Google"}, status=400)

        try:
            # Weryfikacja tokenu u Google
            idinfo = id_token.verify_oauth2_token(
                token,
                requests.Request(),
                settings.GOOGLE_CLIENT_ID
            )

            email = idinfo["email"]
            first_name = idinfo.get("given_name", "")
            last_name = idinfo.get("family_name", "")

        except Exception:
            return Response({"error": "Nieprawidłowy token Google"}, status=400)

        # Pobranie lub utworzenie użytkownika
        user, created = User.objects.get_or_create(
            email=email,
            defaults={"username": email, "first_name": first_name, "last_name": last_name}
        )

        # Generowanie JWT
        refresh = RefreshToken.for_user(user)

        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh)
        })
