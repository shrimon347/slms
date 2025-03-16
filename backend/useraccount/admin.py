from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.translation import gettext_lazy as _
from useraccount.models import User


class UserAdmin(BaseUserAdmin):
    # Define the fields to display in the list view
    list_display = (
        "email",
        "full_name",
        "role",
        "is_staff",
        "is_active",
        "is_verified",
    )
    list_filter = (
        "role",
        "is_staff",
        "is_active",
    )  # Removed 'is_superuser' for simplicity
    search_fields = ("email", "full_name")
    ordering = ("email",)

    # Define fieldsets for the "change user" page
    fieldsets = (
        (None, {"fields": ("email", "password")}),
        (
            _("Personal Info"),
            {
                "fields": (
                    "full_name",
                    "date_of_birth",
                    "contact_number",
                    "profile_picture",
                    "role",
                    "is_verified",
                    "otp",
                )
            },
        ),
        (
            _("Permissions"),
            {
                "fields": (
                    "is_active",
                    "is_staff",
                    "is_superuser",
                    "groups",
                    "user_permissions",
                )
            },
        ),
        (_("Important Dates"), {"fields": ("last_login",)}),
    )

    # Define fields for the "add user" page
    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": ("email", "full_name", "password1", "password2"),
            },
        ),
    )

    # Ensure the password is hashed when saving a new user
    def save_model(self, request, obj, form, change):
        if not change:
            obj.set_password(form.cleaned_data["password1"])
        super().save_model(request, obj, form, change)


# Register the User model with the custom admin class
admin.site.register(User, UserAdmin)
