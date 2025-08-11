from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator

# Create your models here.

class Course(models.Model):
    course_id = models.BigIntegerField(unique=True)
    club_name = models.CharField(max_length=255)
    course_name = models.CharField(max_length=255)
    address = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    country = models.CharField(max_length=100)
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)

    def __str__(self):
        return f"{self.course_id} - {self.club_name} - {self.course_name}"
    
    

class TeeSet(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='tee_sets')
    tee_name = models.CharField(max_length=50)
    gender = models.CharField(max_length=10, choices=[('male', 'Male'), ('female', 'Female')])

    course_rating = models.FloatField()
    slope_rating = models.IntegerField()
    bogey_rating = models.FloatField()

    total_yards = models.IntegerField()
    number_of_holes = models.IntegerField()
    par_total = models.IntegerField(default=None, null=True, blank=True)

    def __str__(self):
        return f"{self.course.course_name} - Tee Color: {self.tee_name} ({self.gender})"

class TeeHole(models.Model):
    tee_set = models.ForeignKey(TeeSet, on_delete=models.CASCADE, related_name='holes')
    hole_number = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(18)])
    par = models.IntegerField(validators=[MinValueValidator(3), MaxValueValidator(7)])
    yardage = models.IntegerField()
    handicap = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(18)], null=True, blank=True, default=None)

    class Meta:
        unique_together = ('tee_set', 'hole_number')

    def __str__(self):
        return f"{self.tee_set} - Hole {self.hole_number}"