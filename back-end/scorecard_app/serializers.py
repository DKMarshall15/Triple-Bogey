from rest_framework import serializers
from django.db.models import Sum
from .models import Course, TeeSet, TeeHole, Scorecard, ScoreEntry


class TeeHoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeeHole
        fields = [
            "hole_number",
            "par",
            "yardage",
            "handicap",
        ]


class ScoreEntrySerializer(serializers.ModelSerializer):
    tee_hole = TeeHoleSerializer()

    class Meta:
        model = ScoreEntry
        fields = ["tee_hole", "strokes"]


class ScorecardSerializer(serializers.ModelSerializer):
    entries = ScoreEntrySerializer(many=True)
    course = serializers.StringRelatedField()
    tee_set = serializers.StringRelatedField()
    total_strokes = serializers.SerializerMethodField()

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
        return obj.entries.aggregate(Sum("strokes"))["strokes__sum"] or 0
