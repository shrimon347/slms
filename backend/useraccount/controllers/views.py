from django.contrib.auth import authenticate
from django.forms import ValidationError
from rest_framework import serializers, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenRefreshView
from useraccount.models import User
from useraccount.permissions import IsAdminOrStaff
from useraccount.renderers import UserRenderer
from useraccount.serializers import (
    ResendOtpSerializer,
    SendPasswordResetEmailSerializer,
    UserChangePasswordSerializer,
    UserLoginSerializer,
    UserOtpVerifySerializer,
    UserPasswordResetSerializer,
    UserProfileSerializer,
    UserRegistrationSerializer,
    UserSerializer,
)
from useraccount.services.user_service import UserService


# Create your views here.
def get_token_for_user(user):
    """Get the token for a user."""
    refresh = RefreshToken.for_user(user)
    return {
        "refresh": str(refresh),
        "access": str(refresh.access_token),
    }


class CustomTokenRefreshView(TokenRefreshView):
    """
    fro refresh token
    """

    renderer_classes = [UserRenderer]
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        refresh_token = request.data.get("refresh")

        if not refresh_token:
            return Response(
                {"error": "Refresh token is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        response = super().post(request, *args, **kwargs)

        return Response(
            {
                "message": "Token refreshed successfully",
                "access": response.data.get("access"),
            },
            status=status.HTTP_200_OK,
        )


class UserRegistrationView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(
            {
                "success": "User registered successfully. Please verify your email. An OTP sent your email."
            },
            status=status.HTTP_201_CREATED,
        )


class ResendOtpView(APIView):
    """
    view to hand otp resend requests
    """

    renderer_classes = [UserRenderer]
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ResendOtpSerializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)

            serializer.resend_otp(serializer.validated_data)
            return Response(
                {"message": "OTP resent successfully."}, status=status.HTTP_200_OK
            )
        except serializers.ValidationError as e:
            return Response(
                {"error": str(e.detail[0])}, status=status.HTTP_400_BAD_REQUEST
            )


class UserVerifyOTPView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserOtpVerifySerializer(data=request.data)
        if serializer.is_valid():
            return Response(
                {"message": "Email verified successfully."}, status=status.HTTP_200_OK
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserLoginView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.data.get("email")
        password = serializer.data.get("password")
        try:
            user = UserService.get_user_by_email(email=email)

        except ValidationError:
            return Response(
                {"errors": "User with this email does not exist."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not user.is_verified:
            return Response(
                {"error": "Please verify your email first."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        user = authenticate(email=email, password=password)
        user_serializer = UserSerializer(user)
        user_data = user_serializer.data
        if user is not None:
            token = get_token_for_user(user)
            return Response(
                {"token": token, "user": user_data, "message": "Login SuccessFull"},
                status=status.HTTP_200_OK,
            )
        else:
            return Response(
                {"errors": {"non_field_errors": ["Email or Password is not Valid"]}},
                status=status.HTTP_404_NOT_FOUND,
            )


class UserProfileView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserProfileSerializer(request.user)
        user_info = serializer.data
        return Response({"user": user_info}, status=status.HTTP_200_OK)

    def patch(self, request):
        try:
            serializer = UserProfileSerializer(
                request.user, data=request.data, partial=True
            )
            serializer.is_valid(raise_exception=True)
            user_id = request.user.id
            updated_user = UserService.update_user(user_id, **serializer.validated_data)
            updated_serlizer = UserProfileSerializer(updated_user)
            updated_user_info = updated_serlizer.data
            return Response(
                {
                    "user": updated_user_info,
                    "message": "User Profile Updated successfully",
                },
                status=status.HTTP_200_OK,
            )

        except ValidationError as e:
            return Response(
                {"error": "Validation Error", "details": e.detail},
                status=status.HTTP_400_BAD_REQUEST,
            )

        except Exception as e:
            return Response(
                {"error": "Internal Server Error", "message": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class UserChangePasswordView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = UserChangePasswordSerializer(
            data=request.data, context={"user": request.user}
        )
        serializer.is_valid(raise_exception=True)
        return Response(
            {"message": "Password Changed Successfully"}, status=status.HTTP_200_OK
        )


class SendPasswordResetEmailView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = SendPasswordResetEmailSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(
            {"message": "Password Reset link sent. Please check your email."},
            status=status.HTTP_200_OK,
        )


class UserPasswordResetView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [AllowAny]

    def post(self, request, uid, token):
        serializer = UserPasswordResetSerializer(
            data=request.data, context={"uid": uid, "token": token}
        )
        serializer.is_valid(raise_exception=True)
        return Response(
            {"message": "Password Reset Successfully"}, status=status.HTTP_200_OK
        )


class UserListView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated, IsAdminOrStaff]

    def get(self, request):
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)
