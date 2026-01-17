from django.urls import path
from .views import AllClubsView, ClubDetailView, SetUserClubView, ClubSearchListView

urlpatterns = [
    # 1. Lista wszystkich (dla dropdownów/mapy)
    path('all/', AllClubsView.as_view(), name='all-clubs-list'),

    # 2. Wyszukiwanie
    path('search/', ClubSearchListView.as_view(), name='clubs-search'),

    # 3. Szczegóły klubu
    path('<int:id>/', ClubDetailView.as_view(), name='club-detail'),

    # 4. Ulubiony klub
    path('user/', SetUserClubView.as_view(), name='user-club'),
]