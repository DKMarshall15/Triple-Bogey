from django.urls import path
from .views import SearchCourses

urlpatterns = [
    path('<str:search_query>/', SearchCourses.as_view(), name='search_courses'),
]