from django.contrib.auth.models import User
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes
from django.core.mail import send_mail
from rest_framework.decorators import api_view
from rest_framework.response import Response


FRONTEND_URL = "http://localhost:3000"   # adres gdzie jest reset hasła

# Tutaj idzie frontend kiedy user wpisze email na który ma przyjsc link do resetu

@api_view(['POST'])
def password_reset_request(request):
    email = request.data.get("email")
    user = User.objects.filter(email=email).first()

    if user:
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)

        reset_url = f"{FRONTEND_URL}/reset-password/{uid}/{token}/"

        send_mail(
            "Reset hasła",
            f"Kliknij link aby zresetować hasło:\n{reset_url}",
            None,
            [email],
        )

    return Response({"message": "Jeśli email istnieje — wysłano link."})


@api_view(['POST'])
def password_reset_confirm(request):
    uidb64 = request.data.get("uid")
    token = request.data.get("token")
    new_password = request.data.get("password")

    try:
        uid = urlsafe_base64_decode(uidb64).decode()
        user = User.objects.get(pk=uid)
    except Exception:
        return Response({"error": "Nieprawidłowy link"}, status=400)

    if not default_token_generator.check_token(user, token):
        return Response({"error": "Token wygasł lub jest nieprawidłowy"}, status=400)

    user.set_password(new_password)
    user.save()

    return Response({"message": "Hasło zmienione poprawnie"})
