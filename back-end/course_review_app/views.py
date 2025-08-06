from django.shortcuts import render
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import CourseReview, Course
from .serializers import CourseReviewSerializer
from user_app.views import UserAuth

# Create your views here.
class AllCourseReviewsView(UserAuth):
    def get(self, request):
        user = request.user
        reviews = CourseReview.objects.filter(user=user)
        serializer = CourseReviewSerializer(reviews, many=True)
        return Response(serializer.data, status=200)

class CourseReviewView(UserAuth):

    def get(self, request, course_id):
        try:
            course = Course.objects.get(course_id=course_id)
            reviews = CourseReview.objects.filter(course=course)
            serializer = CourseReviewSerializer(reviews, many=True)
            return Response(serializer.data, status=200)
        except Course.DoesNotExist:
            return Response({"error": "Course not found"}, status=404)

    def post(self, request, course_id):
        course = get_object_or_404(Course, course_id=course_id)
        serializer = CourseReviewSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user, course=course)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

    def put(self, request, review_id):
        review = get_object_or_404(CourseReview, id=review_id, user=request.user)
        serializer = CourseReviewSerializer(review, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=200)
        return Response(serializer.errors, status=400)

    def delete(self, request, review_id):
        review = get_object_or_404(CourseReview, id=review_id, user=request.user)
        review.delete()
        return Response(status=204)

class CourseFavoriteView(UserAuth):
    def get(self, request):
        # Get all favorite courses for the user
        user = request.user
        favorites = CourseReview.objects.filter(user=user, is_favorite=True)
        serializer = CourseReviewSerializer(favorites, many=True)
        return Response(serializer.data, status=200)
        
    def post(self, request, course_id):
        # add a course to favorites
        try:
            course = Course.objects.get(course_id=course_id)
            review, created = CourseReview.objects.get_or_create(user=request.user, course=course)
            review.is_favorite = True
            review.save()
            response = CourseReviewSerializer(review)
            return Response(response.data, status=201)
        except Course.DoesNotExist:
            return Response({"error": "Course not found"}, status=404)

    def delete(self, request, course_id):
        try:
            course = Course.objects.get(course_id=course_id)
            review = CourseReview.objects.get(user=request.user, course=course)
            review.is_favorite = False
            review.save()
            response = CourseReviewSerializer(review)
            return Response(response.data, status=200)
        except (Course.DoesNotExist, CourseReview.DoesNotExist):
            return Response({"error": "Course or review not found"}, status=404)