from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from models.models import UserProfile
from .serializers import UserClubSerializer, FavoriteClubSerializer
from django.db import IntegrityError

class SetUserClubView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile, created = UserProfile.objects.get_or_create(user=request.user)
        
        serializer = UserClubSerializer(profile)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        profile, created = UserProfile.objects.get_or_create(user=request.user)
        
        serializer = UserClubSerializer(profile, data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "Club assigned successfully"},
                status=status.HTTP_200_OK
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AddFavoriteClubAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = FavoriteClubSerializer(
            data=request.data,
            context={'request': request}
        )

        if serializer.is_valid():
            try:
                favorite = serializer.save()
                return Response(
                    FavoriteClubSerializer(favorite).data,
                    status=status.HTTP_201_CREATED
                )
            except IntegrityError:
                return Response(
                    {"detail": "Club already in favorites"},
                    status=status.HTTP_400_BAD_REQUEST
                )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)