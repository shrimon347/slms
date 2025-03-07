from django.urls import path

from .controllers.views import (
    UserChangePasswordView,
    UserListView,
    UserLoginView,
    UserProfileView,
    UserRegistrationView,
)

urlpatterns = [
    path("register/", UserRegistrationView.as_view(), name="register"),
    path("login/", UserLoginView.as_view(), name="login"),
    path("profile/me/", UserProfileView.as_view(), name="profile"),
    path('changepassword/', UserChangePasswordView.as_view(), name='changepassword'),
    path("allusers/", UserListView.as_view(), name="all-users"),
]
