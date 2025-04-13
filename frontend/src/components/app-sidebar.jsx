import { NavMain } from "@/components/nav-main";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import useAuth from "@/hooks/useAuth";
import roleBasedNavItems from "./shared/MenuItems";

export function AppSidebar({ ...props }) {
  const { user } = useAuth();
  let navItems = [];

  if (user?.role === "student") {
    navItems = roleBasedNavItems.student ?? [];
  } else if (user?.role === "instructor") {
    navItems = roleBasedNavItems.instructor ?? [];
  } else if (user?.role === "admin") {
    navItems = roleBasedNavItems.admin ?? [];
  }
  return (
    <Sidebar collapsible="icon" {...props}>
      <div className="flex justify-end md:hidden">
        <SidebarTrigger />
      </div>
      <SidebarHeader>
        <h2>Shiko</h2>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navItems} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
