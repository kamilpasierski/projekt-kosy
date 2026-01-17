from django.urls import path
from .views import PopularClubsView

urlpatterns = [
    path('', PopularClubsView.as_view(), name='popular-clubs'),
]