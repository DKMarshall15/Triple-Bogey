from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.

class User(AbstractUser):
    # Add any additional fields you want to include in your user model
    email = models.EmailField(unique=True)
    display_name = models.CharField(max_length=55, blank=True, default='unknown')
    gender = models.CharField(max_length=10, blank=True, default='unknown')
    

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.display_name