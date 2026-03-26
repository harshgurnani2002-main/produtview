import os
import django
import sys
import requests
import json

# Add project root and dependencies to path
sys.path.append('/home/legion/Documents/09_django_projects/360_view')
sys.path.append('/home/legion/.local/lib/python3.14/site-packages')
sys.path.append('/usr/lib/python3.14/site-packages')

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from api.models import Product
from django.core.files import File

def verify_api():
    print("Verifying Django REST API...")
    
    # 1. Create a product via Django ORM (for initial data)
    glb_path1 = '/home/legion/Documents/09_django_projects/360_view/vladimir_putin.glb'
    
    if os.path.exists(glb_path1):
        with open(glb_path1, 'rb') as f:
            p = Product.objects.create(
                name="Vladimir Putin 3D",
                description="3D model of Vladimir Putin",
                model_3d=File(f, name='vladimir_putin.glb')
            )
            print(f"Created initial product: {p.name} (ID: {p.id})")

    # 2. Test GET API (mocking the request or using simple response check)
    from api.serializers import ProductSerializer
    products = Product.objects.all()
    serializer = ProductSerializer(products, many=True)
    print("GET /api/products/ data:")
    print(json.dumps(serializer.data, indent=2))

if __name__ == "__main__":
    verify_api()
