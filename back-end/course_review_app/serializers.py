from rest_framework.serializers import ModelSerializer
from .models import CourseReview
from course_api_app.serializers import CourseSerializer


class CourseReviewSerializer(ModelSerializer):
    course = CourseSerializer(read_only=True)
    
    class Meta:
        model = CourseReview
        fields = [
            "user",
            "course",
            "is_favorite",
            "rating",
            "comment",
            "created_at",
            "updated_at",
        ]

