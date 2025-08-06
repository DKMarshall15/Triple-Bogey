from rest_framework.serializers import ModelSerializer
from .models import CourseReview


class CourseReviewSerializer(ModelSerializer):
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

    