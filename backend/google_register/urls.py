from django.urls import path
from .views import GoogleLoginAPIView

urlpatterns = [
    path("", GoogleLoginAPIView.as_view()),
]
