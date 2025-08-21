from django.urls import path
from .views import  CourseFavoriteView, AllCourseNotesView, CourseNotesView

urlpatterns = [
    path('favorites/', CourseFavoriteView.as_view(), name='favorites-list'),
    path('favorites/<int:course_id>/', CourseFavoriteView.as_view(), name='add_favorite'),
    path('', AllCourseNotesView.as_view(), name='course_notes_list'),
    path('<int:course_id>/', CourseNotesView.as_view(), name='course_notes_detail'),
]