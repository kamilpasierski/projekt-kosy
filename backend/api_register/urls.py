from django.urls import path
from . import views

urlpatterns = [
    path('', views.register_user, name='register_post'),
    path('activate/<uidb64>/<token>', views.activate_account, name='activate')
]
