from django.urls import path
from .views import CourseReviewView, CourseFavoriteView, AllCourseReviewsView

urlpatterns = [
    path('favorites/', CourseFavoriteView.as_view(), name='course_favorite'),
    path('favorites/<int:course_id>/add/', CourseFavoriteView.as_view(), name='course_favorite_detail'),
    path('favorites/<int:course_id>/remove/', CourseFavoriteView.as_view(), name='course_favorite_remove'),
    path('', AllCourseReviewsView.as_view(), name='course_review_list'),
    path('<int:course_id>/', CourseReviewView.as_view(), name='course_review_detail'),
    path('<int:review_id>/update/', CourseReviewView.as_view(), name='course_review_update'),
    path('<int:review_id>/delete/', CourseReviewView.as_view(), name='course_review_delete'),
]