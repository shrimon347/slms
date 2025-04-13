import { BookOpen, FileText, Settings, Users, Video } from "lucide-react";

const roleBasedNavItems = {
    student: [
      {
        title: "My Courses",
        url: "my-courses",
        icon: BookOpen,
      },
      {
        title: "Resources",
        url: "my-courses/resources",
        icon: FileText,
      },
      {
        title: "Recordings",
        url: "my-courses/recordings",
        icon: Video,
      },
      {
        title: "Join Class",
        url: "my-courses/join-class",
        icon: Users,
      },
    ],
    instructor: [
      {
        title: "Courses",
        url: "/instructor/courses",
        icon: BookOpen,
      },
      {
        title: "Class Schedule",
        url: "/instructor/schedule",
        icon: Users,
      },
      {
        title: "Upload Resources",
        url: "/instructor/upload-resources",
        icon: FileText,
      },
      {
        title: "Settings",
        url: "/instructor/settings",
        icon: Settings,
      },
    ],
    admin: [
      {
        title: "Users",
        url: "/admin/users",
        icon: Users,
      },
      {
        title: "Manage Courses",
        url: "/admin/manage-courses",
        icon: BookOpen,
      },
      {
        title: "System Settings",
        url: "/admin/system-settings",
        icon: Settings,
      },
    ],
  };
  export default roleBasedNavItems;