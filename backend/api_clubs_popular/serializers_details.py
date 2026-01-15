from rest_framework import serializers
from django.db.models import Q
from models.models import Club, ClubRelation

# Serializer pomocniczy - określa jak wygląda pojedynczy klub na liście "kos" lub "zgód"
class ClubBasicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Club
        fields = ['id', 'name', 'path_image']

# Główny serializer szczegółów klubu
class ClubDetailSerializer(serializers.ModelSerializer):
    kosy = serializers.SerializerMethodField()
    zgody = serializers.SerializerMethodField()
    neutralne = serializers.SerializerMethodField()

    class Meta:
        model = Club
        fields = ['id', 'name', 'city', 'desc', 'path_image', 'kosy', 'zgody', 'neutralne']

    # Metoda pomocnicza do wyciągania relacji "w obie strony"
    def _get_related_clubs(self, club_obj, relation_type_name):
        # Szukamy relacji, gdzie nasz klub jest A LUB B, oraz zgadza się typ relacji
        rels = ClubRelation.objects.filter(
            (Q(club_a=club_obj) | Q(club_b=club_obj)) & Q(relation_type=relation_type_name)
        )
        
        related_clubs = []
        for rel in rels:
            # Jeśli my jesteśmy A, to 'tym drugim' jest B, i odwrotnie
            if rel.club_a == club_obj:
                related_clubs.append(rel.club_b)
            else:
                related_clubs.append(rel.club_a)
        
        # Serializujemy listę znalezionych klubów
        return ClubBasicSerializer(related_clubs, many=True).data

    def get_kosy(self, obj):
        return self._get_related_clubs(obj, 'kosa')

    def get_zgody(self, obj):
        return self._get_related_clubs(obj, 'zgoda') 

    def get_neutralne(self, obj):
        return self._get_related_clubs(obj, 'neutralnie')