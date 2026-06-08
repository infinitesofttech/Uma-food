from requests import Response
from rest_framework import serializers
from .models import *
from django.contrib.auth.models import User


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'
        
class FoodItemSerializer(serializers.ModelSerializer):
    category = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all())
    image = serializers.ImageField(required=False, allow_null=True)
    class Meta:
        model = FoodItems
        fields = '__all__'
        
    def create(self, validated_data):
        validated_data["tags"] = self._parse_json(validated_data.get("tags"))
        validated_data["ingredients"] = self._parse_json(validated_data.get("ingredients"))
        validated_data["nutrition"] = self._parse_json(validated_data.get("nutrition"))
        return super().create(validated_data)

    def update(self, instance, validated_data):
        validated_data["tags"] = self._parse_json(validated_data.get("tags"))
        validated_data["ingredients"] = self._parse_json(validated_data.get("ingredients"))
        validated_data["nutrition"] = self._parse_json(validated_data.get("nutrition"))
        return super().update(instance, validated_data)

    def _parse_json(self, value):
        import json
        if isinstance(value, str):
            try:
                return json.loads(value)
            except:
                return []
        return value
        
class ContactMessageSerializer(serializers.ModelSerializer):
    subject_name = serializers.CharField(source='subject.name', read_only=True)
    class Meta:
        model = ContactMessage
        fields = ['id', 'name', 'email', 'subject', 'subject_name', 'message', 'received_at', 'is_read']
        
class ContactSubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactSubject
        fields = '__all__'

class OrderItemSerializer(serializers.ModelSerializer):
    food_item = FoodItemSerializer()
    class Meta:
        model = OrderItems
        fields = ['id', 'food_item', 'quantity']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = "__all__"

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        order = Order.objects.create(user=self.context['request'].user, **validated_data)

        for item in items_data:
            OrderItems.objects.create(order=order, **item)

        return order
    

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("Email is already registered.")
        return value

    def validate_username(self, value):
        if User.objects.filter(username__iexact=value).exists():
            raise serializers.ValidationError("Username is already taken.")
        return value

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user


class RequestLoginOTPSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)


class VerifyLoginOTPSerializer(serializers.Serializer):
    username = serializers.CharField()
    otp = serializers.CharField(max_length=6)

class CartItemSerializer(serializers.ModelSerializer):
    food_item = FoodItemSerializer()

    class Meta:
        model = CartItem
        fields = ['id', 'food_item', 'quantity']


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)

    class Meta:
        model = Cart
        fields = ['id', 'items']
        
class WishlistItemSerializer(serializers.ModelSerializer):
    food_item = FoodItemSerializer()

    class Meta:
        model = WishlistItem
        fields = ['id', 'food_item']


class WishlistSerializer(serializers.ModelSerializer):
    items = WishlistItemSerializer(many=True, read_only=True)

    class Meta:
        model = Wishlist
        fields = ['id', 'items']
        
