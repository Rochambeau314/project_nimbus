from django.db import models
from django.contrib.auth.models import User
from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver
from datetime import datetime 
from rest_framework.authtoken.models import Token

class Student(models.Model):
    # links each student to their default User model
    user = models.OneToOneField(User, on_delete=models.CASCADE) # I think this extends the User model? Not sure tbh ()

    token = models.TextField(default = "")

    DORM_LOCATIONS = [
        ('K', 'Kissam'),
        ('E', 'EBI'),
        ('Z', 'Zeppos'),
        ('Ro', 'Rothschild'),
        ('Ra', 'Rand'),
        ('B', 'Branscomb'),
        ('H', 'Highland'),
        ('C', 'Commons'),
        ('V', 'Village')
    ]
    dorm = models.CharField(
        max_length=1,
        choices=DORM_LOCATIONS,
        # default=None,
    )

    GENDER_CHOICES = [
        ('M', 'Male'),
        ('F', 'Female'),
        ('O', 'Other'),

    ]
    gender = models.CharField(
        max_length=1,
        choices=GENDER_CHOICES,
        # default=None,
    )

    phone_number = models.TextField(default = "")

    venmo = models.TextField(default = "")

    cashapp = models.TextField(default = "")
    
    @receiver(post_save, sender=User)
    def create_student(sender, instance, created, **kwargs):
        if created:
            Student.objects.create(user=instance)
    
    @receiver(post_save, sender=User)
    def save_student(sender, instance, **kwargs):
        instance.student.save()

class Trip(models.Model):
    trip_id = models.AutoField(primary_key=True)

    student = models.TextField(default = "")

    DORM_LOCATIONS = [
        ('K', 'Kissam'),
        ('E', 'EBI'),
        ('Z', 'Zeppos'),
        ('Ro', 'Rothschild'),
        ('Ra', 'Rand'),
        ('B', 'Branscomb'),
        ('H', 'Highland'),
        ('C', 'Commons'),
        ('V', 'Village')
    ]
    dorm = models.CharField(
        max_length=1,
        choices=DORM_LOCATIONS,
        # default=None,
    )

    pickup_time = models.DateTimeField(default=datetime.now())
    number_of_bags = models.TextField(default = "")

class RideshareRequest(models.Model):
    
    user_trip = models.OneToOneField(Trip, on_delete=models.CASCADE) # need to fix and change current value in database

    partner_trip = models.OneToOneField(Trip, on_delete=models.CASCADE)

    # user who requested the ridshare 
    user_user = models.TextField('') # needed to filter for GET  

    # trip data of the matched person 
    partner_user = models.TextField('') # needed to filter for GET 

    # if the rideshare was confirmed or not 
    confirmed = models.BooleanField()


