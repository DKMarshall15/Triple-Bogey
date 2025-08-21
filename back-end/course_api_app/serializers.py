from rest_framework import serializers
from .models import Course, TeeSet, TeeHole


class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = [
            "course_id",
            "club_name",
            "course_name",
            "address",
        ]

class TeeHoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeeHole
        fields = [
            "hole_number",
            "par",
            "yardage",
            "handicap",
        ]


class TeeSetSerializer(serializers.ModelSerializer):
    holes = TeeHoleSerializer(many=True)

    class Meta:
        model = TeeSet
        fields = [
            "id",  # Add this line!
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
    tee_sets = TeeSetSerializer(many=True, read_only=True)

    class Meta:
        model = Course
        fields = [
            "course_id",
            "club_name",
            "course_name",
            "address",
            "longitude",
            "latitude",
            "tee_sets",
        ]
