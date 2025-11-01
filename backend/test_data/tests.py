from django.test import TestCase
from django.urls import reverse
from .models import Item



class ItemModelTest(TestCase):
    def test_create_item(self):
        
        item = Item.objects.create(name="Piłka")
        self.assertEqual(str(item), "Piłka")  
        self.assertIsNotNone(item.created)    



class IndexViewTest(TestCase):
    def test_index_view_status_code(self):
        
        response = self.client.get(reverse('index'))
        self.assertEqual(response.status_code, 200)

    def test_index_template_used(self):
        
        response = self.client.get(reverse('index'))
        self.assertTemplateUsed(response, 'index.html')