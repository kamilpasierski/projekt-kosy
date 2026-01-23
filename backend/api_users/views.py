from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
from .serializers import UserSerializer


@api_view(['GET'])
def getData(request):
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)


@api_view(['GET', 'PATCH'])
@permission_classes([IsAuthenticated])
def getCurrentUser(request):
    if request.method == 'PATCH':
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    serializer = UserSerializer(request.user)
    return Response(serializer.data)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def deleteAccount(request):
    """Endpoint do usunięcia konta użytkownika"""
    user = request.user
    user_id = user.id
    
    try:
        user.delete()
        return Response({
            'detail': f'Konto użytkownika {user_id} zostało pomyślnie usunięte.'
        }, status=200)
    except Exception as e:
        return Response({
            'detail': f'Błąd podczas usuwania konta: {str(e)}'
        }, status=500)


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def changePassword(request):
    """Endpoint do zmiany hasła użytkownika"""
    user = request.user
    old_password = request.data.get('old_password')
    new_password = request.data.get('new_password')

    # Walidacja: sprawdź czy podano oba pola
    if not old_password or not new_password:
        return Response({
            'detail': 'Wymagane są pola: old_password i new_password.'
        }, status=400)

    # Walidacja: sprawdź czy stare hasło jest poprawne
    if not user.check_password(old_password):
        return Response({
            'old_password': ['Nieprawidłowe hasło.']
        }, status=400)

    # Walidacja: sprawdź długość nowego hasła
    if len(new_password) < 8:
        return Response({
            'new_password': ['Hasło musi mieć minimum 8 znaków.']
        }, status=400)

    # Ustaw nowe hasło i zapisz
    user.set_password(new_password)
    user.save()

    return Response({
        'detail': 'Hasło zostało pomyślnie zmienione.'
    }, status=200)