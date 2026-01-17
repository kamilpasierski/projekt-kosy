from django.urls import path
from .views import AllClubsView, ClubSearchListView

urlpatterns = [
    path('all/', AllClubsView.as_view(), name='clubs-all'),

    path('search/', ClubSearchListView.as_view(), name='clubs-search'),
]