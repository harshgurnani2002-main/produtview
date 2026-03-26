import re
from rest_framework import serializers
from .models import Product, ProductImage
from django.db import transaction

class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'order']

class ProductSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = ['id', 'name', 'description', 'model_3d', 'created_at', 'images']

    def create(self, validated_data):
        # Access images from the request files
        request = self.context.get('request')
        images_data = request.FILES.getlist('images')
        
        # Sort images by filename (natural sort) to ensure correct order
        # This ensures Filename_01 comes before Filename_02, etc.
        images_data.sort(key=lambda x: [int(c) if c.isdigit() else c.lower() for c in re.split('([0-9]+)', x.name)])
        
        with transaction.atomic():
            product = Product.objects.create(**validated_data)
            
            for i, image_data in enumerate(images_data):
                ProductImage.objects.create(
                    product=product,
                    image=image_data,
                    order=i
                )
                
        return product
