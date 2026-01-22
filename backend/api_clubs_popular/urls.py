from django.urls import path
from .views import PopularClubsView, IncrementClubPointsView

urlpatterns = [
    path('', PopularClubsView.as_view(), name='popular-clubs'),
    path('increment/<int:club_id>/', IncrementClubPointsView.as_view(), name='increment-club-points'),
]