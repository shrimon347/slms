from course.repositories import module_repository


class ModuleService:
    def __init__(self):
        self.repo = module_repository()

    def get_modules_by_course(self, course_id: int):
        """Get all modules of a specific course."""
        return self.repo.get_all(course_id)

    def get_module_by_id(self, module_id: int):
        """Get a module by its ID."""
        return self.repo.get_by_id(module_id)

    def create_module(self, **data):
        """Create a new module."""
        return self.repo.create(**data)

    def update_module(self, module_id: int, **data):
        """Update an existing module."""
        return self.repo.update(module_id, **data)

    def delete_module(self, module_id: int):
        """Delete a module."""
        return self.repo.delete(module_id)
