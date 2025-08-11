from wsgiref import headers
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
import requests
import os
from .models import Course, TeeSet, TeeHole
from .serializers import CourseSerializer, CourseDetailSerializer


def save_courses_from_api(api_data):
    # This function can be used to fetch courses from the external API
    # and save them to the database if needed.
    
    course_list = api_data.get("courses", [])
    for course_data in course_list:
        course_id = course_data.get("id")
        # Check if the course already exists
        if Course.objects.filter(course_id=course_id).exists():
            print(f"Course with ID {course_id} already exists.")
            continue
        course, _ = Course.objects.update_or_create(
            course_id=course_data.get("id"),
            defaults={
                "club_name": course_data.get("club_name"),
                "course_name": course_data.get("course_name"),
                "address": course_data.get("location", {}).get("address"),
                "city": course_data.get("location", {}).get("city"),
                "state": course_data.get("location", {}).get("state"),
                "country": course_data.get("location", {}).get("country"),
                "latitude": course_data.get("location", {}).get("latitude"),
                "longitude": course_data.get("location", {}).get("longitude"),
            },
        )
        for gender in ["male", "female"]:
            tee_sets = course_data.get("tees", {}).get(gender, [])
            for tee_data in tee_sets:
                tee_set, _ = TeeSet.objects.update_or_create(
                    course=course,
                    tee_name=tee_data.get("tee_name"),
                    gender=gender,
                    defaults={
                        "course_rating": tee_data.get("course_rating"),
                        "slope_rating": tee_data.get("slope_rating"),
                        "bogey_rating": tee_data.get("bogey_rating"),
                        "total_yards": tee_data.get("total_yards"),
                        "number_of_holes": tee_data.get("number_of_holes"),
                        "par_total": tee_data.get("par_total"),
                    },
                )

                for idx, hole in enumerate(tee_data.get("holes", []), start=1):  # tee_data["holes"] is a list of holes
                    # Create or update TeeHole instances
                    TeeHole.objects.update_or_create(
                        tee_set=tee_set,
                        hole_number=idx,
                        defaults={
                            "par": hole.get("par"),
                            "yardage": hole.get("yardage"),
                            "handicap": hole.get("handicap"),
                        },
                    )


# Create your views here.
# view to get 20 nearest golf courses
# using the golf course api
# https://golfcourseapi.com/docs/v1/search


class SearchCourses(APIView):
    def get(self, request, search_query):
        # Example: Fetching a list of courses from an external API
        # Authorization: Key <your API key>
        api_url = "https://api.golfcourseapi.com/v1/search"
        headers = {"Authorization": f"Key {os.getenv('GOLF_COURSE_API_KEY')}"}
        # Add search query as a parameter
        params = {
            "search_query": search_query,
        }
        # Make a GET request to the external API with the search query
        response = requests.get(api_url, headers=headers, params=params)

        if response.status_code == 200:
            data = response.json()

            # Save or update courses to your DB
            save_courses_from_api(data)

            # Extract course IDs from API data
            course_ids = [course.get("id") for course in data.get("courses", [])]

            # Fetch saved courses from the DB and serialize them
            courses = Course.objects.filter(course_id__in=course_ids)
            course_serializer = CourseSerializer(courses, many=True)

            return Response(course_serializer.data, status=200)
        else:
            return Response(
                {"error": "Failed to fetch courses"}, status=response.status_code
            )

# View to get details of a specific course by course_id
class CourseDetail(APIView):
    def get(self, request, course_id):
        try:
            course = Course.objects.get(course_id=course_id)
            # Serialize the course data
            course_serializer = CourseDetailSerializer(course)
            return Response(course_serializer.data, status=200)
        except Course.DoesNotExist:
            return Response({"error": "Course not found"}, status=404)

class AllCoursesDetail(APIView):
    def get(self, request):
        # Fetch all courses from the database
        courses = Course.objects.all()
        course_serializer = CourseDetailSerializer(courses, many=True)
        return Response(course_serializer.data, status=200)
        

