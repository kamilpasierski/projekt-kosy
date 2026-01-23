from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from models.models import UserProfile, FavoriteClub, ActivityLog, Club
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
            favorite = serializer.save()
            id = favorite.club_id
            club = get_object_or_404(Club, id=id)

            ActivityLog.objects.create(
                user=request.user,
                action="ADD_FAVORITE",
                object=f"Club: {club.name}",
                details="ERROR - Integrity"
            )

            return Response(
                {"message": "Club assigned successfully"},
                status=status.HTTP_200_OK
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AddFavoriteClubAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        favorites = FavoriteClub.objects.filter(user=request.user)
        serializer = FavoriteClubSerializer(favorites, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = FavoriteClubSerializer(
            data=request.data,
            context={'request': request}
        )

        if serializer.is_valid():
            try:
                favorite = serializer.save()
                id = favorite.club_id
                club = get_object_or_404(Club, id=id)

                ActivityLog.objects.create(
                    user=request.user,
                    action="ADD_FAVORITE",
                    object=f"Club: {club.name}",
                    details="SUCCESS"
                )

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

    def delete(self, request, pk=None):
        if pk is None:
             return Response({"detail": "ID is required for deletion"}, status=status.HTTP_400_BAD_REQUEST)

        Favclub = get_object_or_404(FavoriteClub, id=pk)
        id = Favclub.club
        # club = get_object_or_404(Club, id=id)

        ActivityLog.objects.create(
            user=request.user,
            action="DELETE_FAVORITE",
            object=f"Club: {id}",
            details="SUCCESS"
        )
        favorite = get_object_or_404(FavoriteClub, pk=pk, user=request.user)
        favorite.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    def patch(self, request, pk=None):
        if pk is None:
            return Response({"detail": "ID is required for update"}, status=status.HTTP_400_BAD_REQUEST)

        favorite = get_object_or_404(FavoriteClub, pk=pk, user=request.user)
        
        if 'mute' in request.data:
            favorite.mute = request.data['mute']
            favorite.save()
            
            ActivityLog.objects.create(
                user=request.user,
                action="UPDATE_FAVORITE_MUTE",
                object=f"Club: {favorite.club.name}",
                details=f"Mute set to {favorite.mute}"
            )
            
        return Response(FavoriteClubSerializer(favorite).data, status=status.HTTP_200_OK)