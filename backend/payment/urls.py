from django.urls import path
from payment.controllers.views import (
    CheckoutView,
    EnrollmentListView,
    VerifyPaymentView,
)

urlpatterns = [
    path("checkout/", CheckoutView.as_view(), name="checkout"),
    path("verify-payment/", VerifyPaymentView.as_view(), name="verify-payment"),
    path("my-courses/", EnrollmentListView.as_view(), name="my-courses"),
]
