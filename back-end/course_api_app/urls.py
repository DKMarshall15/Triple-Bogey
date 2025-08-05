from django.urls import path
from .views import SearchCourses, CourseApiView

urlpatterns = [
    path('', CourseApiView.as_view(), name='search_courses'),
    path('<str:search_query>/', SearchCourses.as_view(), name='search_courses'),
]