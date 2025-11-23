from django.urls import path
from . import views  
from rest_framework.authtoken.views import obtain_auth_token  

urlpatterns = [
    path('profile/', views.profile, name='profile'),
    path('api-token-auth/', obtain_auth_token, name='api_token_auth'),
]
