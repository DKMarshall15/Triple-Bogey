from django.db import models
from user_app.models import User
from course_api_app.models import Course
from django.core.validators import MinValueValidator, MaxValueValidator

# Create your models here.
class CourseReview(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='course_reviews')
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='reviews')

    is_favorite = models.BooleanField(default=False)
    rating = models.PositiveSmallIntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)], blank=False, null=False)

    comment = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
        models.UniqueConstraint(fields=['user', 'course'], name='unique_user_course_review')
    ]

    def __str__(self):
        return f"{self.user.username} - {self.course.course_name} ({self.rating or 'No Rating'})"
    

