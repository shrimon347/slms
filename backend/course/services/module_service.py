from course.repositories.module_repository import ModuleRepository


class ModuleService:
    @staticmethod
    def get_modules_by_course(course_id: int):
        """Get all modules of a specific course."""
        return ModuleRepository.get_all(course_id)

    @staticmethod
    def get_module_by_id(module_id: int):
        """Get a module by its ID."""
        return ModuleRepository.get_by_id(module_id)

    @staticmethod
    def create_module(**data):
        """Create a new module."""
        return ModuleRepository.create(**data)

    @staticmethod
    def update_module(module_id: int, **data):
        """Update an existing module."""
        return ModuleRepository.update(module_id, **data)

    @staticmethod
    def delete_module(module_id: int):
        """Delete a module."""
        return ModuleRepository.delete(module_id)
