from django.urls import path
from .views import password_reset_request, password_reset_confirm

urlpatterns = [
    path("", password_reset_request),
    path("confirm/", password_reset_confirm),
]
