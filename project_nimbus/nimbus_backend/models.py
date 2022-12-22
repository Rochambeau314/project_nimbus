from django.db import models
from django.contrib.auth.models import User
from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver
from datetime import datetime 
from rest_framework.authtoken.models import Token

# class Student(models.Model):
#     # links each student to their default User model
#     user = models.OneToOneField(User, on_delete=models.CASCADE) # I think this extends the User model? Not sure tbh ()

#     token = models.TextField(default = "")

#     DORM_LOCATIONS = [
#         ('K', 'Kissam'),
#         ('E', 'EBI'),
#         ('Z', 'Zeppos'),
#         ('Ro', 'Rothschild'),
#         ('Ra', 'Rand'),
#         ('B', 'Branscomb'),
#         ('H', 'Highland'),
#         ('C', 'Commons'),
#         ('V', 'Village')
#     ]

#     GENDER_CHOICES = [
#         ('M', 'Male'),
#         ('F', 'Female'),
#         ('O', 'Other'),

#     ]
#     gender = models.CharField(
#         max_length=1,
#         choices=GENDER_CHOICES,
#         # default=None,
#     )

#     phone_number = models.TextField(default = "")

#     venmo = models.TextField(default = "")

#     cashapp = models.TextField(default = "")

#     def __str__(self):
#         return self.user
    
#     @receiver(post_save, sender=User)
#     def create_student(sender, instance, created, **kwargs):
#         if created:
#             Student.objects.create(user=instance)
    
#     @receiver(post_save, sender=User)
#     def save_student(sender, instance, **kwargs):
#         instance.student.save()


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
        max_length=2,
        choices=DORM_LOCATIONS,
    )

    number_of_bags = models.TextField(default = "")
    confirmed = models.BooleanField(default = False)

    trip_datetime = models.TextField(default = "")
    day = models.TextField(default = "")
    hour = models.TextField(default = "")
    minute = models.TextField(default = "")
    month = models.TextField(default = "")
    weekday = models.TextField(default = "")
    ap = models.TextField(default = "")

class RideshareRequest(models.Model):

    # user who requested the ridshare 
    user_user = models.TextField('') # needed to filter for GET  

    # trip data of the matched person 
    partner_user = models.TextField('') # needed to filter for GET 
    
    user_trip = models.ManyToManyField(Trip, related_name = 'u_trip')

    partner_trip = models.ManyToManyField(Trip, related_name = 'p_trip')

    # if the rideshare was confirmed or not 
    confirmed = models.BooleanField()    
