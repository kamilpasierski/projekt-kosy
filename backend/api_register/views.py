from rest_framework.decorators import api_view
from django.http import HttpResponseRedirect
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.response import Response
from .serializers import RegisterSerializer
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.contrib.auth.tokens import default_token_generator as token_generator

@csrf_exempt
@api_view(['POST'])
def register_user(request):
    serializer = RegisterSerializer(data=request.data)
    print("Requested data:", request.data)

    if serializer.is_valid():
        user = serializer.save()

        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = token_generator.make_token(user)
        activation_link = f"https://projekt-kosy.onrender.com/api/register/activate/{uid}/{token}"

        # Wysłanie maila aktywacyjnego
        context = {
            'user': user,
            'activation_link': activation_link,
            'site_name': 'My Awesome Site',
            'expiration_days': 1,
        }

        subject = "Aktywuj swoje konto"
        message = render_to_string('emails/activation_email.txt', context)
        send_mail(subject, message, 'no-reply@pilkarskie-kosy.pl', [user.email])

        # ✅ Komunikat zgodny z testem
        return Response(
            {"message": "Użytkownik został pomyślnie utworzony."},
            status=status.HTTP_201_CREATED
        )

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def activate_account(request, uidb64, token):
    try:
        uid = force_str(urlsafe_base64_decode(uidb64))
        user = User.objects.get(pk=uid)
    except (TypeError, ValueError, OverflowError, User.DoesNotExist):
        return Response({'error': 'Nieprawidłowy link'}, status=status.HTTP_400_BAD_REQUEST)

    if token_generator.check_token(user, token):
        user.is_active = True
        user.save()
        return HttpResponseRedirect("https://projekt-kosy-m4e6.onrender.com/?status=activated")
    else:
        return Response({'error': 'Token jest nieprawidłowy lub wygasł'}, status=status.HTTP_400_BAD_REQUEST)
