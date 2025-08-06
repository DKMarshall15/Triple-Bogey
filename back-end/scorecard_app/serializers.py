from rest_framework import serializers
from django.db.models import Sum
from .models import Scorecard, ScoreEntry
from course_api_app.serializers import TeeSetSerializer, TeeHoleSerializer, CourseSerializer


class ScoreEntrySerializer(serializers.ModelSerializer):
    tee_hole = TeeHoleSerializer()

    class Meta:
        model = ScoreEntry
        fields = ["tee_hole", "strokes"]


class ScorecardSerializer(serializers.ModelSerializer):
    entries = ScoreEntrySerializer(many=True)
    course = CourseSerializer()
    tee_set = TeeSetSerializer()
    total_strokes = serializers.SerializerMethodField()
    user = serializers.StringRelatedField()  # Assuming User model has a __str__ method

    class Meta:
        model = Scorecard
        fields = [
            "user",
            "course",
            "tee_set",
            "date_played",
            "entries",
            "total_strokes",
        ]

    def get_total_strokes(self, obj):
        return obj.entries.all().aggregate(Sum("strokes"))["strokes__sum"] or 0
