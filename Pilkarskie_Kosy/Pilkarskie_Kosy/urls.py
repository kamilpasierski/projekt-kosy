from django.contrib import admin
from django.urls import path, include


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
    path('api_users/', include('api_users.urls')),
    path('', include('test_data.urls')),
]
