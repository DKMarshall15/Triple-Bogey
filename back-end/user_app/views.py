from django.shortcuts import render
from django.contrib.auth import authenticate, login, logout
from .models import User
from .serializers import UserSerializer
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
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            try:
                user = serializer.save()
                login(request, user)
                token = Token.objects.create(user=user)
                
                # Use serializer to return user data (excludes password)
                user_serializer = UserSerializer(user)
                return Response({
                    "user": user_serializer.data,  # Full user object
                    "token": token.key
                }, status=s.HTTP_201_CREATED)
            except Exception as e:
                return Response(
                    {"error": "Failed to create user"}, 
                    status=s.HTTP_400_BAD_REQUEST
                )
        else:
            return Response(serializer.errors, status=s.HTTP_400_BAD_REQUEST)

class UserLogin(APIView):
    def post(self, request):
        data = request.data.copy()
        data['username'] = request.data.get("username", request.data.get("email"))
        user = authenticate(request, username=data.get('username'), password=data.get("password"))
        if user is not None:
            token, created = Token.objects.get_or_create(user=user)
            
            # Use serializer to return user data
            user_serializer = UserSerializer(user)
            return Response({
                'user': user_serializer.data,  # Full user object
                'token': token.key
            }, status=s.HTTP_200_OK)
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
        serializer = UserSerializer(request.user)
        return Response({"user": serializer.data})

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