from course.models import Module


class ModuleRepository:
    @staticmethod
    def get_module_by_id(module_id: int):
        """Retrieve a single module by ID."""
        try:
            return Module.objects.get(id=module_id)
        except Module.DoesNotExist:
            return None

    @staticmethod
    def get_all_modules(course_id: int):
        """Retrieve all modules for a specific course."""
        return Module.objects.filter(course_id=course_id)

    @staticmethod
    def create(**data):
        """Create a new module."""
        return Module.objects.create(**data)

    @staticmethod
    def update(module_id: int, **data):
        """Update an existing module."""
        try:
            module = Module.objects.get(id=module_id)
            for key, value in data.items():
                setattr(module, key, value)
            module.save()
            return module
        except Module.DoesNotExist:
            return None

    @staticmethod
    def delete(module_id: int):
        """Delete a module."""
        try:
            module = Module.objects.get(id=module_id)
            module.delete()
            return True
        except Module.DoesNotExist:
            return False
