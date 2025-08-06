from django.db import models
from user_app.models import User
from course_api_app.models import Course, TeeSet, TeeHole
from django.core.validators import MinValueValidator, MaxValueValidator

# Create your models here.
class Scorecard(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='scorecards')
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    tee_set = models.ForeignKey(TeeSet, on_delete=models.CASCADE)
    
    date_played = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"Scorecard for {self.user} at {self.course} on {self.date_played}"
    
class ScoreEntry(models.Model):
    scorecard = models.ForeignKey(Scorecard, on_delete=models.CASCADE, related_name='entries')
    tee_hole = models.ForeignKey(TeeHole, on_delete=models.CASCADE)
    strokes = models.IntegerField(null=True, blank=True)  # allow user to fill this in later

    def __str__(self):
        return f"Score Entry for {self.scorecard} - {self.tee_hole}: {self.strokes or '-'} strokes"