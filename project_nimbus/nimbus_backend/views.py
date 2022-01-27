from django.contrib.auth.models import User, Group
from rest_framework import viewsets, permissions, status, request
from project_nimbus.nimbus_backend.serializers import TripSerializer, UserSerializer, GroupSerializer, StudentSerializer
from project_nimbus.nimbus_backend.models import RideshareRequest, Trip
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
import requests
import jwt 
import json 
from django.http import HttpResponse, JsonResponse
from rest_framework.response import Response
from django.shortcuts import redirect
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated, AllowAny  # <-- Here
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt

from project_nimbus.nimbus_backend.secrets import client_secret


# Create your views here.
class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class GroupViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]




@csrf_exempt
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_data(request, format=None):
    print('user_data has run')
    current_user = request.user
    current_token = request.auth
    print(current_user, current_token)
    data =  {'name': current_user.username, 'email': current_user.email}
    return Response(data=data, status=200)


@csrf_exempt
@api_view(['GET'])
@permission_classes([AllowAny])
def GoogleOAuth(request, format=None):
    if request.method == 'GET':

        # pull the data out 
        data = request.GET
        print('data', data)

        
        # pull out Google Auth code 
        gCode = data['code']

        package = {
        'code': gCode,
        'client_id':'1004886906155-d7b2r83i0u8d7ks1bvv1b6rgrdp673gk.apps.googleusercontent.com',
        'client_secret':client_secret,
        'redirect_uri': 'http://127.0.0.1:8000/GoogleOAuth',
        'grant_type': 'authorization_code'
        }
        
        # ask Google for access token 
        response = requests.post('https://oauth2.googleapis.com/token', data=package)
        json_response = response.json()
        print('json_response', json_response)

        # isolate the access token from the header and rest of data 
        # access_token = json_response['access_token']
        # print('access token', access_token)

        # isolate the id token from the header and rest of data 
        id_token = json_response['id_token']
        # print(id_token)

        # decode id token 
        # audience = '926069317015-pgfot71erehglt8biagmqr16p06eqa30.apps.googleusercontent.com' # why did I not need this before? 
        decoded_id_token = jwt.decode(id_token, options={"verify_signature": False})
        # print(decoded_id_token)

        # pull name and email 

        name = decoded_id_token['name'].replace(" ", "")
        user_email = decoded_id_token['email']
        user_data = name, user_email
        print(user_data)

        # search users for a current match; already existing --> sign in, no match --> create an account 

        users_response = requests.get('http://127.0.0.1:8000/users/') # grab entire list of users 
        users = users_response.json() # convert to json 
        print('list of users', users)
        


        # search for match 
        for user in users: 
            print(name, user['username'], name == user['username'])
            print(user_email, user['email'], user_email == user['email'])

            if user['username'] == name and user['email'] == user_email:
                userobj = User.objects.get(username=name)
                print(userobj)
                # print(userobj.student.token)
                print('match! sign them in!')

                # send token to frontend; frontend will sign the user in and redirect to Dashboard 
                home_link = 'http://127.0.0.1:3000/Home/' + userobj.student.token
                return redirect(home_link)
                # sessions? 
                # return so following code does not run 

        # no match: create a new account 
        # call a method to create a new user: username = name, email = user_email, student = null 
        new_user = User.objects.create(
            username = name,
            email = user_email)

        print(new_user)

        token = Token.objects.create(user=new_user)
        new_user.student.token = token.key
        new_user.save()
        # add token to student object 
        # new_user.student.access_token = access_token # currently a normal access token; will probably need to be replaced by a refresh token as AT will expire 
        # new_user.save()
    
        newuser_link = 'http://127.0.0.1:3000/NewUser/' + token.key
        return redirect(newuser_link)

@csrf_exempt
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_student(request, format=None):
    student_data = request.data
    current_user = request.user 
    current_user.student.dorm = student_data['dorm']
    current_user.student.gender = student_data['gender']
    current_user.student.phone_number = student_data['phone_number']
    current_user.student.venmo = student_data['venmo']
    current_user.student.cashapp = student_data['cashapp']

    current_user.save()
    return Response(status=200)

@csrf_exempt
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def student_data(request, format=None):
    current_user = request.user
    student = current_user.student
    serializer = StudentSerializer(student)
    print(student)
    return Response(serializer.data, status=200)

@csrf_exempt
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def create_trip(request, format=None):

    # adding a new trip
    if request.method == 'POST':
        
        trip_data = request.data
        current_user = request.user 
        current_trips = Trip.objects.filter(student = current_user.username)

        # only add a new trip if the user has no current trips 
        if len(current_trips) == 0: 
            print('user has no trips')
            new_trip = Trip(student = current_user, dorm = trip_data['dorm'], pickup_time = trip_data['pickup_time'], number_of_bags=trip_data['number_of_bags'])
            new_trip.save()
        
        # if the user has already created a trip, tell the browser to send an error saying that the user already has a trip created 
        else: 
            print('user has a trip already')
            current_trips.delete()
            new_trip = Trip(student = current_user, dorm = trip_data['dorm'], pickup_time = trip_data['pickup_time'], number_of_bags=trip_data['number_of_bags'])
            new_trip.save()

        return Response(status=200)

    # requesting current list of trips 
    if request.method == 'GET':
        current_user = request.user 
        trips_list = Trip.objects.exclude(student = current_user.username)
        serializer = TripSerializer(trips_list, many=True)
        print(serializer.data)
        return Response(serializer.data, status=200)

@csrf_exempt
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def my_trips(request, format=None):
    current_user = request.user

    # send the user's trips
    if request.method == 'GET': 
        trips_list = Trip.objects.filter(student = current_user.username)
        print('name', current_user.username)
        serializer = TripSerializer(trips_list, many=True)
        print('my_trips', serializer.data)
        return Response(serializer.data, status=200)

    # delete the specified trip of the user 
    if request.method == 'POST': 
        pass

@csrf_exempt
@api_view(['GET', 'POST', 'PUT', 'DELETE'])
def rideshare_request(request, format = None): 

    # create a new rideshare request 
    if request.method == 'POST': 
        # print(request.data)

        # pull data out from request 
        user_data = request.data['user_trip']
        partner_data = request.data['partner_trip']
        # print(user_trip, partner_trip)

        # grab both trip objects 
        user = user_data[0]['student']
        partner = partner_data['student']
        # print(user_trip, partner_trip)

        # save both trip data into a rideshare request 
        new_request = RideshareRequest(user = user, partner = partner, confirmed = False)
        new_request.save() 

        return Response(status=200)

    # confirm a rideshare request 
    elif request.method == 'GET': 
        pass
        # set rideshare confirmation to True 
        # delete both trip objects

    # edit the rideshare request
    elif request.method == 'PUT': 
        # pull the new rideshare request data 
        # save the new rideshare request
        pass 

    elif request.method == "DELETE": 
        # convert rideshare request data back into 2 Trip objects 
        # delete the rideshare request 
        pass

