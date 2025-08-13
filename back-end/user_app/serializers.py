from rest_framework import serializers
from .models import User
from django.core.exceptions import ValidationError
from django.db import IntegrityError
from django.contrib.auth.hashers import make_password

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)  # Add password field
    username = serializers.CharField(required=False)  # Make username optional
    
    class Meta:
        model = User
        fields = ['id', 'email', 'display_name', 'gender', 'password', 'username']
        extra_kwargs = {
            'password': {'write_only': True},  # Never return password in responses
        }

    def create(self, validated_data):
        # Extract password before creating user
        password = validated_data.pop('password')
        
        # Set defaults
        if not validated_data.get('username'):
            validated_data['username'] = validated_data.get('email')
        if not validated_data.get('display_name'):
            validated_data['display_name'] = validated_data['username']
        
        # Create user with hashed password
        user = User.objects.create_user(
            password=password,
            **validated_data
        )
        return user

    def update(self, instance, validated_data):
        # Handle password separately
        password = validated_data.pop('password', None)
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        # Hash password if provided
        if password:
            instance.set_password(password)
        
        instance.full_clean()
        instance.save()
        return instance

class PasswordChangeSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, min_length=8)
    
    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Old password is incorrect.")
        return value
    
    def save(self):
        user = self.context['request'].user
        user.set_password(self.validated_data['new_password'])
        user.save()
        return user