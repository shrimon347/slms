import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link } from "react-router"; // Use `Link` from react-router-dom

export function NavMain({ items }) {
  return (
    <SidebarGroup>
      {/* Group Label */}
      <SidebarGroupLabel>Platform</SidebarGroupLabel>

      {/* Main Menu */}
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            {/* Menu Button with Icon and Link */}
            <SidebarMenuButton asChild>
              <Link to={item.url}>
                {item.icon && <item.icon />} {/* Render dynamic icon */}
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
