from django.urls import path
from .views import SearchCourses, CourseDetail, AllCoursesDetail

urlpatterns = [
    path('', AllCoursesDetail.as_view(), name='all_courses'),
    path('<str:search_query>/', SearchCourses.as_view(), name='search_courses'),
    path('course/<int:course_id>/', CourseDetail.as_view(), name='course_detail'),
]