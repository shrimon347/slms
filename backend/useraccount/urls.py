from django.urls import path
from useraccount.controllers.views import UserListView

urlpatterns = [
    path("allusers/", UserListView.as_view(), name="all-users"),
]
