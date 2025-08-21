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
                print(f"Fetching scorecard {scorecard_id} for user {user}")  # Debug log
                scorecard = (
                    Scorecard.objects.filter(user=user)
                    .prefetch_related("entries__tee_hole")
                    .get(id=scorecard_id)
                )
                serializer = ScorecardSerializer(scorecard)
                print(f"Serialized data: {serializer.data}")  # Debug log
                return Response(serializer.data)
            except Scorecard.DoesNotExist:
                print(f"Scorecard {scorecard_id} not found for user {user}")  # Debug log
                return Response({"error": "Scorecard not found"}, status=404)
            except Exception as e:
                print(f"Error fetching scorecard: {str(e)}")  # Debug log
                return Response({"error": str(e)}, status=400)
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
        raw_scores_data = request.data.get("scores", [])
        tee_set_id = request.data.get("tee_set_id")

        # Handle both data formats: direct list or nested object
        if isinstance(raw_scores_data, dict) and "scores" in raw_scores_data:
            scores_data = raw_scores_data["scores"]  # Extract from nested
            if not tee_set_id:  # Get tee_set_id from nested data if available
                tee_set_id = raw_scores_data.get("tee_set_id")
        elif isinstance(raw_scores_data, list):
            scores_data = raw_scores_data  # Use directly
        else:
            scores_data = []

        try:
            course = Course.objects.get(course_id=course_id)

            if tee_set_id:
                tee_set = TeeSet.objects.get(id=tee_set_id, course=course)
            else:
                # Safe fallback for userprofile
                try:
                    gender = request.user.userprofile.gender
                    tee_set = TeeSet.objects.get(course=course, gender=gender)
                except (AttributeError, TeeSet.DoesNotExist):
                    # Get first available tee set as fallback
                    tee_set = TeeSet.objects.filter(course=course).first()
                    if not tee_set:
                        return Response({"error": "No tee sets available"}, status=400)

            # Create scorecard
            scorecard = Scorecard.objects.create(
                user=request.user, course=course, tee_set=tee_set
            )

            # Create entries with scores
            if scores_data:
                for score_data in scores_data:
                    hole_number = score_data.get("hole_number")
                    strokes = int(score_data.get("strokes", 0))  # Convert to int

                    try:
                        tee_hole = tee_set.holes.get(hole_number=hole_number)
                        ScoreEntry.objects.create(
                            scorecard=scorecard,
                            tee_hole=tee_hole,
                            strokes=strokes,
                        )
                    except tee_set.holes.model.DoesNotExist:
                        continue

            serializer = ScorecardSerializer(scorecard)
            return Response(
                {
                    "message": "Scorecard created",
                    "scorecard_id": scorecard.id,
                    "scorecard": serializer.data,
                }
            )

        except Course.DoesNotExist:
            return Response({"error": "Course not found"}, status=404)
        except Exception as e:
            print(f"Scorecard creation error: {str(e)}")
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
                entry.save()
                return Response({"message": "Score updated"})
            else:
                return Response({"error": "Strokes value required"}, status=400)
        except ScoreEntry.DoesNotExist:
            return Response({"error": "Score entry not found"}, status=404)
        except Exception as e:
            return Response({"error": str(e)}, status=400)
