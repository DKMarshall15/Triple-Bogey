from django.urls import path
from .views import CourseReviewView, CourseFavoriteView, AllCourseReviewsView

urlpatterns = [
    path('favorites/', CourseFavoriteView.as_view(), name='favorites-list'),
    path('favorites/<int:course_id>/', CourseFavoriteView.as_view(), name='add_favorite'),
    path('', AllCourseReviewsView.as_view(), name='course_review_list'),
    path('<int:course_id>/', CourseReviewView.as_view(), name='course_review_detail'),
    path('<int:review_id>/update/', CourseReviewView.as_view(), name='course_review_update'),
    path('<int:review_id>/delete/', CourseReviewView.as_view(), name='course_review_delete'),
]