from django.contrib.auth.models import User, Group
from rest_framework import viewsets, permissions, status, request
from project_nimbus.nimbus_backend.serializers import RideshareRequestSerializer, TripSerializer, UserSerializer, GroupSerializer, StudentSerializer
from project_nimbus.nimbus_backend.models import RideshareRequest, Trip, Student
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
from simplegmail import Gmail
from project_nimbus.nimbus_backend.secrets import client_secret

# mike perez 

# warning/user agreement that 
# "honor the agency of the user "

# men 
# women 
# trans/gender queer/gender nonbinary 
# Other 
# prefer not to say 

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
    # #print('user_data has run')
    current_user = request.user
    current_token = request.auth
    # #print(current_user, current_token)
    data =  {'name': current_user.username, 'email': current_user.email}
    return Response(data=data, status=200)

@csrf_exempt
@api_view(['GET'])
@permission_classes([AllowAny])
def GoogleOAuth(request, format=None):
    if request.method == 'GET':

        # pull the data out 
        data = request.GET
        # #print('data', data)

        
        # pull out Google Auth code 
        gCode = data['code']

        package = {
        'code': gCode,
        'client_id':'1004886906155-d7b2r83i0u8d7ks1bvv1b6rgrdp673gk.apps.googleusercontent.com',
        'client_secret': client_secret,
        'redirect_uri': 'https://idlehands.pythonanywhere.com/GoogleOAuth',
        'grant_type': 'authorization_code'
        }
        
        # ask Google for access token 
        response = requests.post('https://oauth2.googleapis.com/token', data=package)
        json_response = response.json()
        print('json_response', json_response)

        # isolate the access token from the header and rest of data 
        # #print('access token', access_token)

        # isolate the id token from the header and rest of data 
        id_token = json_response['id_token']
        # #print(id_token)

        # decode id token 
        # audience = '926069317015-pgfot71erehglt8biagmqr16p06eqa30.apps.googleusercontent.com' # why did I not need this before? 
        decoded_id_token = jwt.decode(id_token, options={"verify_signature": False})
        # #print(decoded_id_token)

        # pull name and email 

        name = decoded_id_token['name'].replace(" ", "")
        user_email = decoded_id_token['email'] 
        user_data = name, user_email
        # #print(user_data)

        # search users for a current match; already existing --> sign in, no match --> create an account 

        users_response = requests.get('https://idlehands.pythonanywhere.com/users/') # grab entire list of users 
        users = users_response.json() # convert to json 
        # #print('list of users', users)
        
        # search for match 
        for user in users: 
            # #print(name, user['username'], name == user['username'])
            # #print(user_email, user['email'], user_email == user['email'])

            if user['username'] == name and user['email'] == user_email:
                userobj = User.objects.get(username=name)
                # #print(userobj)
                # #print(userobj.student.token)
                # #print('match! sign them in!

                # send token to frontend; frontend will sign the user in and redirect to Dashboard 
                home_link = 'https://project-nimbus.vercel.app//Home/' + userobj.student.token
                return redirect(home_link)
                # sessions? 
                # return so following code does not run 

        # no match: create a new account 
        # call a method to create a new user: username = name, email = user_email, student = null 
        new_user = User.objects.create(
            username = name,
            email = user_email)

        # #print(new_user)

        token = Token.objects.create(user=new_user)
        # #print('token', token)
        new_user.student.token = token.key
        new_user.save()
        # add token to student object 
        # new_user.student.access_token = access_token # currently a normal access token; will probably need to be replaced by a refresh token as AT will expire 
        # new_user.save()
    
        newuser_link = 'https://project-nimbus.vercel.app/NewUser/' + token.key
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
    
    #print('sending welcome email')
    requests.get('https://idlehands.pythonanywhere.com/send_email/', data = {'email': current_user.email})

    return Response(status=200)

@csrf_exempt
@api_view(['GET', "POST"])
@permission_classes([IsAuthenticated])
def student_data(request, format=None):
    if request.method == 'GET': 
        current_user = request.user
        student = current_user.student
        serializer = StudentSerializer(student) 
        # #print(student)
    elif request.method == 'POST': 
        name_dict = request.data.keys()
        name = [str(key) for key in name_dict]
        #print(name)        

        user = User.objects.get(username = name[0])
        serializer = StudentSerializer(user.student)

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
            # #print('user has no trips')
            new_trip = Trip(student = current_user, dorm = trip_data['dorm'], pickup_time = trip_data['pickup_time'], number_of_bags=trip_data['number_of_bags'])
            new_trip.save()
        
        # if the user has already created a trip, tell the browser to send an error saying that the user already has a trip created 
        else: 
            # #print('user has a trip already')
            current_trips.delete()
            new_trip = Trip(student = current_user, dorm = trip_data['dorm'], pickup_time = trip_data['pickup_time'], number_of_bags=trip_data['number_of_bags'])
            new_trip.save()

        return Response(status=200)

    # requesting current list of trips 
    if request.method == 'GET':
        current_user = request.user # grab current user 

        # list of trips without own trip 
        trips_list = Trip.objects.exclude(student = current_user.username).exclude(confirmed = True)
        serializer = TripSerializer(trips_list, many=True)
        trips_data = serializer.data

        # grab all rideshare requests involving the user 
        rr_requests = RideshareRequest.objects.filter(user_user = current_user) | RideshareRequest.objects.filter(partner_user = current_user) # grab all relevant rr_requests
        serializer2 = RideshareRequestSerializer(rr_requests, context={'request': request}, many=True) # serialize rr_request data 

        # remove any trips already in the user's rideshare requests 
        for rr_data in serializer2.data: 
            #print(rr_data['user_trip'])
            if rr_data['user_trip'][0] in trips_data:
                #print('user_trip removed')
                trips_data.remove(rr_data['user_trip'][0])
    
            elif rr_data['partner_trip'][0] in trips_data: 
                #print('partner_trip removed')
                trips_data.remove(rr_data['partner_trip'][0])
                
        #print('trips_data', trips_data)
        return Response(trips_data, status=200)

@csrf_exempt
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def my_trips(request, format=None):
    current_user = request.user

    # send the user's trips
    if request.method == 'GET': 
        trips_list = Trip.objects.filter(student = current_user.username)
        # #print('name', current_user.username)
        serializer = TripSerializer(trips_list, many=True)
        # #print('my_trips', serializer.data)
        return Response(serializer.data, status=200)

@csrf_exempt
@api_view(['GET', 'POST', 'PUT', 'DELETE'])
@permission_classes([AllowAny])
def rideshare_request(request, format = None): 
    # create a new rideshare request/edit a rideshare request 
    if request.method == 'POST': 
        # #print(request.data)

        # pull data out from request 
        user_name = request.data['user_trip'][0]['student']
        partner_name = request.data['partner_trip']['student']
        # grab both trip objects 
        u_trip = Trip.objects.filter(student=user_name)[0]
        p_trip = Trip.objects.filter(student=partner_name)[0]
        # #print('trip objects', TripSerializer(u_trip).data, TripSerializer(p_trip).data)
        # #print()
        
        # save both trip data into a rideshare request if one does not already exist  
        if RideshareRequest.objects.filter(user_user = user_name, partner_user = partner_name).exists() or RideshareRequest.objects.filter(user_user = partner_name, partner_user = user_name).exists():
            return Response(status=200) # don't save; just redirect to home

        else:
            new_request = RideshareRequest(user_user = user_name, partner_user = partner_name, confirmed = False)
            new_request.save()
            new_request.user_trip.add(u_trip)
            new_request.partner_trip.add(p_trip)

            # #print("new request", RideshareRequestSerializer(new_request).data)

            return Response(status=200)

    # return all rideshare requests that the user is in  
    elif request.method == 'GET': 
        current_user = request.user.username
        # #print(current_user)

        # https://books.agiliq.com/projects/django-orm-cookbook/en/latest/or_query.html
        rr_requests = RideshareRequest.objects.filter(user_user = current_user) | RideshareRequest.objects.filter(partner_user = current_user)
        # #print(rr_requests, 'rr_requests')

        serializer = RideshareRequestSerializer(rr_requests, context={'request': request}, many=True)

        # #print('rr_request', serializer.data)

        partner_trips = []

        for rr in serializer.data: 
            if rr['confirmed']: 
                if rr['user_user'] == current_user: 
                    return(Response(rr['partner_trip']))
                else:
                    return(Response(rr['user_trip']))

            elif rr['user_user'] == current_user: 
                partner_trips.append(rr['partner_trip'][0]) 
            else:
                partner_trips.append(rr['user_trip'][0])

        # #print(partner_trips)
        return(Response(partner_trips, status=200))


    # return a specific rideshare request
    elif request.method == 'PUT': 

        #print(request.data)

        # grab names 
        user_name = request.data['user_trip'][0]['student']
        partner_name = request.data['partner_trip'][0]['student']

        #print('PUT', user_name, partner_name)

        # https://books.agiliq.com/projects/django-orm-cookbook/en/latest/or_query.html
        rr_requests = RideshareRequest.objects.filter(user_user = user_name) | RideshareRequest.objects.filter(partner_user = user_name)
        # #print(rr_requests, 'rr_requests')

        serializer = RideshareRequestSerializer(rr_requests, context={'request': request}, many=True)
        if rr_requests.exists():
            #print('specific rideshare request', serializer.data[0])
            return Response(serializer.data[0], status = 200)
        return (Response(status = 302))
        
 
     # delete the unconfirmed rideshare request
    elif request.method == "DELETE": 
        #print('data in delete', request.data)
        # grab relevant data

        user_name = request.data['rideshare_data']['user_trip'][0]['student']
        partner_name = request.data['rideshare_data']['partner_trip'][0]['student']
        #print('DELETE', user_name, partner_name)

        # delete the specific request 
        rr_request = RideshareRequest.objects.filter(user_user = user_name) | RideshareRequest.objects.filter(partner_user = user_name)
        #print(rr_request)
        # #print(RideshareRequestSerializer(rr_request, many=True).data)
        rr_request.delete() 

        user_trip = Trip.objects.get(student = user_name)
        user_trip.confirmed = False
        user_trip.save()

        partner_trip = Trip.objects.get(student = partner_name)
        partner_trip.confirmed = False
        partner_trip.save()

        return Response(status=200)
        
@csrf_exempt
@api_view(['GET', 'POST', 'DELETE'])
def confirmed_request(request, format = None): 
    # return the confirmed request
    if request.method == 'GET': 
        #print('get')

        current_user = request.user.username
        # #print(current_user)

        # https://books.agiliq.com/projects/django-orm-cookbook/en/latest/or_query.html 
        confirmed_req = RideshareRequest.objects.filter(user_user = current_user) | RideshareRequest.objects.filter(partner_user = current_user)
        # #print(confirmed_req, 'confirmed_req')

        serializer = RideshareRequestSerializer(confirmed_req, context={'request': request}, many=True)
        # #print('confirmed_req_data', serializer.data)
        
        # return actual data if exists; if not, return empty list 
        if serializer.data:
            return(Response(serializer.data[0], status=200))
        else: 
            return(Response(serializer.data, status=200))

    elif request.method == "POST": 
        # confirm the rideshare request: 
        rr_data = request.data
        #print('rr_data', rr_data)

        user = rr_data[0]['student']
        user_trip = Trip.objects.get(student=user)

        partner = rr_data[1]['student']
        partner_trip = Trip.objects.get(student=partner)

        #print(user, partner)

        # stop and redirect if either user already has a confirmed trip
        if user_trip.confirmed or partner_trip.confirmed:
            return Response(status=302)
        
        # change status of RideshareRequest to confirmed 
        relevant_rr_req = RideshareRequest.objects.filter(user_user = user, partner_user = partner) | RideshareRequest.objects.filter(user_user = partner, partner_user = user)
        #print(relevant_rr_req)
        if relevant_rr_req.exists():
            req_obj = relevant_rr_req.first()
            req_obj.confirmed = True
            req_obj.save()

            # TODO: mark both associated Trip objects as confirmed 
            trip_one = Trip.objects.get(student = user)
            #print(trip_one)
            trip_one.confirmed = True
            trip_one.save()

            trip_two = Trip.objects.get(student=partner)
            #print(trip_two)
            trip_two.confirmed = True 
            trip_two.save()

            # delete all unconfirmed requests that included the 2 users that were just marked as confirmed, but not the one including both users 
            rr_req_all = RideshareRequest.objects.filter(user_user = user) | RideshareRequest.objects.filter(partner_user = user) | RideshareRequest.objects.filter(user_user = partner) | RideshareRequest.objects.filter(partner_user = partner)
            # #print(RideshareRequestSerializer(rr_req_user, many=True).data)

            for rr in rr_req_all: 
                #print('rr user and partner', (rr.user_user, user, rr.partner_user, partner))
                if rr.confirmed != True: 
                    # delete the rr_request 
                    rr.delete()
                # #print(RideshareRequestSerializer(rr).data)

            # send email 
            print({'user_trip': TripSerializer(trip_one).data, 'partner_trip': TripSerializer(trip_two).data})
            email_data = {'partner_trip': TripSerializer(trip_two).data}
            requests.put('https://idlehands.pythonanywhere.com/send_email/', data = {'user': user, 'partner': partner})
            return Response(status=200)
        else:
            return Response(status=302)

    # delete a confirmed request
    elif request.method == 'DELETE': 
        #print(request.data)
        # grab relevant data

        user_name = request.data['rideshare_data']['user_trip'][0]['student']
        partner_name = request.data['rideshare_data']['partner_trip'][0]['student']
        #print('DELETE', user_name, partner_name)

        rr_request = RideshareRequest.objects.filter(user_user = user_name) | RideshareRequest.objects.filter(partner_user = user_name)
        #print('del rr_request', rr_request)

        #print(RideshareRequestSerializer(rr_request, many=True).data)

        # mark both trips inside the request as unconfirmed 
        u_trip = Trip.objects.get(student = user_name)
        #print(u_trip)
        u_trip.confirmed = False
        u_trip.save()

        p_trip = Trip.objects.get(student = partner_name)
        #print(p_trip)
        p_trip.confirmed = False
        p_trip.save()

        # delete the specific request 
        rr_request.delete()

        # #print(RideshareRequestSerializer(rr_request).data)

        return Response(status=200)

@csrf_exempt
@api_view(['GET', 'POST', 'PUT', 'DELETE'])
def send_email(request, format=None):    
    #print('send_email', request.data)
    gmail = Gmail() # will open a browser window to ask you to log in and authenticate

    params = {
        "to": '',
        "sender": "idlehandsvanderbilt@gmail.com",
        "subject": '',
        "msg_html": "",
        "msg_plain": '',
        "signature": True  # use my account signature
    }

    # account created; welcome to project nimbus
    if request.method == 'GET': 
        receiver_email = request.data['email']
        #print(receiver_email)

        params['subject'] = 'welcome to Project Nimbus!'
        params['msg_html'] = "Thank you for joining Project Nimbus! Project Nimbus aims to enable all Vanderbilt Students to safely, successfully, and efficiently arrange rideshare carpooling to and from the airport. <br /> The project is currently in beta, so please disregard any design choices that have been made and react out to jason.l.tan@vanderbilt.edu if you experience any bugs. Thank you very much!  ."
        params['to'] = receiver_email

        email = gmail.send_message(**params)  # equivalent to send_message(to="you@youremail.com", sender=...)


    # received a request
    elif request.method == 'POST': 
        target_student = request.data['student']
        #print(target_student)
        target_user = User.objects.get(username = target_student)
        #print(target_user)
        receiver_email = target_user.email
        #print(receiver_email)

        params['subject'] = 'Project Nimbus: You Have a New Request!'
        params['msg_html'] = 'You have received a rideshare request!'
        params['to'] = receiver_email

        email = gmail.send_message(**params)  # equivalent to send_message(to="you@youremail.com", sender=...)

    # the request has been confirmed 
    elif request.method =='PUT': 
        print('put')
        print(request.data)
        # user = request.data['user_trip']['student']
        # partner = request.data['partner_trip']['student']
        # print(user, partner)

        target_user = User.objects.get(username = request.data['user'])
        target_partner = User.objects.get(username = request.data['partner'])
        #print(target_user, target_partner)  

        user_email = target_user.email
        partner_email = target_partner.email
        #print(user_email, partner_email)


        params['subject'] = 'Project Nimbus: Carpool Confirmed!'
        params['msg_html'] = 'Your Carpool Request has been Confirmed!!'
        params['to'] = user_email
        email = gmail.send_message(**params)  # equivalent to send_message(to="you@youremail.com", sender=...)

        params['to'] = partner_email
        email = gmail.send_message(**params)  # equivalent to send_message(to="you@youremail.com", sender=...)
    
    # the request has been deleted (only sent to the person who didn't delete the request)
    elif request.method == 'DELETE': 
        #print('del', request.data)
        
        partner = request.data['partner_trip'][0]['student']
        #print(partner)

        target_partner = User.objects.get(username = partner)
        #print(target_partner)   

        partner_email = target_partner.email
        #print(partner_email)

        params['to'] = partner_email
        params['subject'] = 'Project Nimbus: Request Cancelled'
        params['msg_html'] = 'Your rideshare request has been cancelled. Submit another request here.'

        email = gmail.send_message(**params)  # equivalent to send_message(to="you@youremail.com", sender=...)


    return Response(status=200)