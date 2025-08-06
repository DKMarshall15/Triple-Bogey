from rest_framework import serializers
from models import Course, TeeSet
from scorecard_app.serializers import TeeHoleSerializer


class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = [
            "course_id",
            "club_name",
            "course_name",
            "address",
        ]


class TeeSetSerializer(serializers.ModelSerializer):
    holes = TeeHoleSerializer(many=True)

    class Meta:
        model = TeeSet
        fields = [
            "tee_name",
            "gender",
            "course_rating",
            "slope_rating",
            "bogey_rating",
            "total_yards",
            "number_of_holes",
            "par_total",
            "holes",
        ]


class CourseDetailSerializer(serializers.ModelSerializer):
    tee_sets = TeeSetSerializer(many=True)

    class Meta:
        model = Course
        fields = [
            "course_id",
            "club_name",
            "course_name",
            "address",
            "tee_sets",
        ]
