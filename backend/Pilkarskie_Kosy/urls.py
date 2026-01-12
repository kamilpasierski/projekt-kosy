from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [

    path('admin/', admin.site.urls),
    path('api/users/', include('api_users.urls')),
    path('api/register/', include('api_register.urls')),
    path('google/register/', include('google_register.urls')),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/ticketcreate/', include('api_ticket_create.urls')),
    path("clubs/autocomplete/", include("api_autocomplete_clubs")),
    path('api_login/', include('api_login.urls')),
    path("password-reset/", include('reset_password.urls')),

]


if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
