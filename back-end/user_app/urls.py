from django.urls import path, include
from .views import UserSignup, UserLogin, UserLogout, UserProfile

urlpatterns = [
    path('profile/', UserProfile.as_view(), name='user_profile'),
    path('signup/', UserSignup.as_view(), name='user_signup'),
    path('login/', UserLogin.as_view(), name='user_login'),
    path('logout/', UserLogout.as_view(), name='user_logout'),
]
