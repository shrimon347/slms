from django.urls import path
from .controllers.views import UserListView, UserRegistrationView

urlpatterns = [
    path('register/', UserRegistrationView.as_view(), name='register'),
    path("allusers/", UserListView.as_view(), name="all-users"),
]
