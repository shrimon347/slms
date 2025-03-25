from django.urls import path

from .controllers.views import (
    CustomTokenRefreshView,
    SendPasswordResetEmailView,
    UserChangePasswordView,
    UserListView,
    UserLoginView,
    UserPasswordResetView,
    UserProfileView,
    UserRegistrationView,
    UserVerifyOTPView,
)

urlpatterns = [
    path("register/", UserRegistrationView.as_view(), name="register"),
    path("login/", UserLoginView.as_view(), name="login"),
    path("token/refresh/", CustomTokenRefreshView.as_view(), name="token_refresh"),
    path("verify-email/", UserVerifyOTPView.as_view(), name="verify-email"),
    path("profile/", UserProfileView.as_view(), name="profile"),
    path("changepassword/", UserChangePasswordView.as_view(), name="changepassword"),
    path(
        "send-reset-password-email/",
        SendPasswordResetEmailView.as_view(),
        name="send-reset-password-email",
    ),
    path(
        "reset-password/<str:uid>/<str:token>/",
        UserPasswordResetView.as_view(),
        name="reset-password",
    ),
    path("allusers/", UserListView.as_view(), name="all-users"),
]
