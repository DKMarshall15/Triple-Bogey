from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Course, TeeSet, Scorecard, ScoreEntry
from .serializers import ScorecardSerializer
from user_app.views import UserAuth 


# Create your views here.
class ScorecardView(UserAuth):
    # List ALL scorecards OR get a SINGLE scorecard
    def get(self, request, scorecard_id=None):
        user = request.user
        
        if scorecard_id:
            # Get single scorecard
            try:
                scorecard = Scorecard.objects.filter(user=user).prefetch_related(
                    "entries__tee_hole"
                ).get(id=scorecard_id)
                serializer = ScorecardSerializer(scorecard)
                return Response(serializer.data)
            except Scorecard.DoesNotExist:
                return Response({"error": "Scorecard not found"}, status=404)
        else:
            # Get all scorecards (existing functionality)
            scorecards = Scorecard.objects.filter(user=user).prefetch_related(
                "entries__tee_hole"
            )
            serializer = ScorecardSerializer(scorecards, many=True)
            return Response(serializer.data)

    # Create scorecard
    # This method allows users to create a new scorecard for a specific course
    def post(self, request):
        course_id = request.data.get("course_id")
        user = request.user

        try:
            course = Course.objects.get(id=course_id)
            gender = user.userprofile.gender
            tee_set = TeeSet.objects.get(course=course, gender=gender)

            # Create scorecard
            scorecard = Scorecard.objects.create(
                user=user, course=course, tee_set=tee_set
            )

            # Create blank entries for each hole
            for tee_hole in tee_set.holes.order_by("number"):
                ScoreEntry.objects.create(scorecard=scorecard, tee_hole=tee_hole)

            return Response(
                {"message": "Scorecard created", "scorecard_id": scorecard.id}
            )
        except Exception as e:
            return Response({"error": str(e)}, status=400)

    # Update scorecard
    # This method allows users to update the strokes for multiple holes in a scorecard
    def put(self, request, scorecard_id):
        try:
            scorecard = Scorecard.objects.get(id=scorecard_id, user=request.user)
            entries_data = request.data.get("entries", [])

            for entry_data in entries_data:
                tee_hole_id = entry_data.get("tee_hole_id")
                strokes = entry_data.get("strokes")

                # Update or create score entry
                ScoreEntry.objects.update_or_create(
                    scorecard=scorecard,
                    tee_hole_id=tee_hole_id,
                    defaults={"strokes": strokes},
                )

            return Response({"message": "Scorecard updated"})
        except Scorecard.DoesNotExist:
            return Response({"error": "Scorecard not found"}, status=404)
        except Exception as e:
            return Response({"error": str(e)}, status=400)

    # Delete scorecard
    # This method allows users to delete a scorecard by its ID
    def delete(self, request, scorecard_id):
        try:
            scorecard = Scorecard.objects.get(id=scorecard_id, user=request.user)
            scorecard.delete()
            return Response({"message": "Scorecard deleted"})
        except Scorecard.DoesNotExist:
            return Response({"error": "Scorecard not found"}, status=404)
        except Exception as e:
            return Response({"error": str(e)}, status=400)

    # Update score entry
    # This method allows users to update the strokes for a specific score entry
    def patch(self, request, entry_id):
        try:
            entry = ScoreEntry.objects.get(id=entry_id, scorecard__user=request.user)
            strokes = request.data.get("strokes")

            if strokes is not None:
                entry.strokes = strokes
                entry.full_clean()  # Validate the entry
                entry.save()
                return Response({"message": "Score entry updated", "strokes": entry.strokes})
            else:
                return Response({"error": "Strokes value is required"}, status=400)
        except ScoreEntry.DoesNotExist:
            return Response({"error": "Score entry not found"}, status=404)
        except Exception as e:
            return Response({"error": str(e)}, status=400)