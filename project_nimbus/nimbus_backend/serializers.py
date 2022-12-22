from django.contrib.auth.models import User, Group
from rest_framework import serializers
from project_nimbus.nimbus_backend.models import Trip, RideshareRequest
# from project_nimbus.nimbus_backend.models import Student

# class StudentSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Student
#         fields = ['token', 'gender', 'phone_number', 'venmo', 'cashapp']

class TripSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trip
        fields = ['trip_id', 'student', 'dorm', 'number_of_bags', 'confirmed',  'trip_datetime', 'weekday', 'month', 'day', 'hour', 'minute', 'ap']

class RideshareRequestSerializer(serializers.ModelSerializer):
    user_trip = TripSerializer(many=True)
    partner_trip = TripSerializer(many=True)
    class Meta:
        model = RideshareRequest
        fields = ['user_user', 'partner_user', 'user_trip', 'partner_trip', 'confirmed']


class UserSerializer(serializers.ModelSerializer):
    # student = StudentSerializer()

    class Meta:
        model = User
        fields = ['url', 'username', 'email', 'token', 'groups']

    # def create(self, validated_data):
    #     student_data = validated_data.pop('student')
    #     user = User.objects.create(**validated_data)
    #     Student.objects.create(user=user, **student_data)
    #     return user

class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ['url', 'name']