from django.contrib import admin
from django.urls import path, include
from api_clubs_all.views import ClubSearchListView
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
    path('api/tickets/', include('api_ticket_list.urls')),
    path("clubs/autocomplete/", include("api_autocomplete_clubs.urls")),
    path('api/clubs/popular/', include('api_clubs_popular.urls')),
    path('api/clubs/', include('api_clubs_all.urls')),
    path('clubs/search/', ClubSearchListView.as_view(), name='clubs-search'),
    path('api_login/', include('api_login.urls')),
    path("password-reset/", include('reset_password.urls')),
    path('api/stats/', include('api_stats.urls')),
    path('api/relations/', include('api_relations.urls')),
    path('api/add_fav/', include('api_add_fav.urls')),
]


if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
