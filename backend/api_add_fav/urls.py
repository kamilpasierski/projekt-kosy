from django.urls import path
from . import views

urlpatterns = [
    path('', views.SetUserClubView.as_view()),
    path('watched_clubs', views.AddFavoriteClubAPIView.as_view()), 
    path('watched_clubs/<int:pk>/', views.AddFavoriteClubAPIView.as_view()), 
]