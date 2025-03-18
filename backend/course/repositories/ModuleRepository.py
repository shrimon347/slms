from course.models import Module


class ModuleRepository:
    def get_by_id(self, module_id: int):
        """Retrieve a single module by ID."""
        try:
            return Module.objects.get(id=module_id)
        except Module.DoesNotExist:
            return None

    def get_all(self, course_id: int):
        """Retrieve all modules for a specific course."""
        return Module.objects.filter(course_id=course_id)

    def create(self, **data):
        """Create a new module."""
        return Module.objects.create(**data)

    def update(self, module_id: int, **data):
        """Update an existing module."""
        try:
            module = Module.objects.get(id=module_id)
            for key, value in data.items():
                setattr(module, key, value)
            module.save()
            return module
        except Module.DoesNotExist:
            return None

    def delete(self, module_id: int):
        """Delete a module."""
        try:
            module = Module.objects.get(id=module_id)
            module.delete()
            return True
        except Module.DoesNotExist:
            return False
