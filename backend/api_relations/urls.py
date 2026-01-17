from django.urls import path
from .views import relation_update_view, get_all_relations

urlpatterns = [
    # GET /api/relations/ -> Zwraca listę (dla mapy)
    path('', get_all_relations, name='relations-list'),

    # POST /api/relations/update/ -> Aktualizacja (dla admina)
    path('update/', relation_update_view, name='relation-update'),
]