from wsgiref import headers
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
import requests
import os

# from requests_oauthlib import OAuth1


# Create your views here.
# view to get 20 nearest golf courses
# using the golf course api
# https://golfcourseapi.com/docs/v1/search
class CourseApiView(APIView):
    def get(self, request):
        # Example: Fetching a list of courses from an external API
        # Authorization: Key <your API key>
        api_url = "https://api.golfcourseapi.com/v1/search"
        headers = {"Authorization": f"Key {os.getenv('GOLF_COURSE_API_KEY')}"}
        params = {
            "search_query": "Highland",
            "city": "Elgin",
        }

        response = requests.get(api_url, headers=headers, params=params)
        if response.status_code == 200:
            data = response.json()
            courses = data.get("courses", [])

            # Extract only the fields we want from each course
            filtered_courses = []
            for course in courses:
                filtered_course = {
                    "id": course.get("id"),
                    "club_name": course.get("club_name"),
                    "course_name": course.get("course_name"),
                    "address": course.get("location", {}).get("address"),
                }
                filtered_courses.append(filtered_course)

            return Response({"courses": filtered_courses}, status=response.status_code)
        else:
            return Response(
                {"error": "Failed to fetch courses"}, status=response.status_code
            )


class SearchCourses(APIView):
    def get(self, request, search_query):
        # Example: Fetching a list of courses from an external API
        # Authorization: Key <your API key>
        api_url = "https://api.golfcourseapi.com/v1/search"
        headers = {"Authorization": f"Key {os.getenv('GOLF_COURSE_API_KEY')}"}
        # Add search query as a parameter
        params = {
            "search_query": search_query,
            # "Location": "chicago"
        }
        # Make a GET request to the external API with the search query
        response = requests.get(api_url, headers=headers, params=params)

        if response.status_code == 200:
            data = response.json()
            courses = data.get("courses", [])

            # Extract only the fields we want from each course
            filtered_courses = []
            for course in courses:
                filtered_course = {
                    "id": course.get("id"),
                    "club_name": course.get("club_name"),
                    "course_name": course.get("course_name"),
                    "address": course.get("location", {}).get("address"),
                }
                filtered_courses.append(filtered_course)

            return Response({"courses": filtered_courses})
        else:
            return Response(
                {"error": "Failed to fetch courses"}, status=response.status_code
            )
