from django.shortcuts import render
from django.contrib.auth import authenticate, login, logout
from .models import User
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status as s
from rest_framework.permissions import IsAuthenticated
from rest_framework.authtoken.models import Token
from rest_framework.authentication import TokenAuthentication
from django.core.exceptions import ValidationError

# Create your views here.
class UserSignup(APIView):
    def post(self, request):
        data = request.data.copy()
        data['username'] = request.data.get("username", request.data.get("email"))
        data['display_name'] = request.data.get('display_name', data['username'])
        new_user = User(**data)
        try:
            new_user.full_clean()
            new_user.save()
            new_user.set_password(data.get("password"))
            new_user.save()
            login(request, new_user)
            token = Token.objects.create(user = new_user)
            return Response({"user":new_user.display_name, "token":token.key}, status=s.HTTP_201_CREATED)
        except ValidationError as e:
            print(e)
            return Response(e.messages, status=s.HTTP_400_BAD_REQUEST)

class UserLogin(APIView):
    def post(self, request):
        data = request.data.copy()
        data['username'] = request.data.get("username", request.data.get("email"))
        user = authenticate(request, username=data.get('username'), password=data.get("password"))
        if user is not None:
            login(request, user)
            token, created = Token.objects.get_or_create(user=user)
            return Response({'user': user.display_name, 'token': token.key}, status=s.HTTP_200_OK)
        return Response({'error': 'Invalid credentials'}, status=s.HTTP_401_UNAUTHORIZED)
    
class UserAuth(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

class UserLogout(UserAuth):
    def post(self, request):
        request.user.auth_token.delete()
        logout(request)
        return Response({'message': 'Logged out successfully'}, status=s.HTTP_204_NO_CONTENT)

class UserProfile(UserAuth):
    def get(self, request):
        return Response({"user": request.user})

    def put(self, request):
        try:
            data = request.data.copy()
            ruser = request.user
            # check for display_name, age, address
            ruser.display_name = data.get("display_name", ruser.display_name)
            ruser.age = data.get("age", ruser.age)
            ruser.address = data.get("address", ruser.address)
            # authenticate credential
            cur_pass = data.get("password")
            if cur_pass and data.get("new_password"):
                auth_user = authenticate(username = ruser.username, password = cur_pass)
                if auth_user == ruser:
                    ruser.set_password(data.get("new_password"))
                    
            # if credentials match the user
            # update password and save it
            ruser.full_clean()
            ruser.save()
            return Response({"display_name":ruser.display_name, "age":ruser.age, "address":ruser.address})
        except ValidationError as e:
            print(e)
            return Response(e, status=s.HTTP_400_BAD_REQUEST)
        
    def delete(self, request):
        try:
            request.user.delete()
            return Response({"message": "User deleted successfully"}, status=s.HTTP_204_NO_CONTENT)
        except Exception as e:
            print(e)
            return Response({"error": "Failed to delete user"}, status=s.HTTP_400_BAD_REQUEST)