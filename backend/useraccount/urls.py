from django.urls import path
from .controllers.views import UserListView, UserLoginView, UserRegistrationView

urlpatterns = [
    path('register/', UserRegistrationView.as_view(), name='register'),
     path('login/', UserLoginView.as_view(), name='login'),
    path("allusers/", UserListView.as_view(), name="all-users"),
]
