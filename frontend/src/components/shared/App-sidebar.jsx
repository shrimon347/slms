import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react";
import { Link } from "react-router"; // Import Link from react-router-dom

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import NavMain from "./Nav-main";
import NavProjects from "./Nav-projects";
import NavUser from "./Nav-user";
import { TeamSwitcher } from "./Team-switch";

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Playground",
      url: "/playground", // Replace "#" with actual route paths
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "History",
          url: "/playground/history",
        },
        {
          title: "Starred",
          url: "/playground/starred",
        },
        {
          title: "Settings",
          url: "/playground/settings",
        },
      ],
    },
    {
      title: "Models",
      url: "/models",
      icon: Bot,
      items: [
        {
          title: "Genesis",
          url: "/models/genesis",
        },
        {
          title: "Explorer",
          url: "/models/explorer",
        },
        {
          title: "Quantum",
          url: "/models/quantum",
        },
      ],
    },
    {
      title: "Documentation",
      url: "/docs",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "/docs/introduction",
        },
        {
          title: "Get Started",
          url: "/docs/get-started",
        },
        {
          title: "Tutorials",
          url: "/docs/tutorials",
        },
        {
          title: "Changelog",
          url: "/docs/changelog",
        },
      ],
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "/settings/general",
        },
        {
          title: "Team",
          url: "/settings/team",
        },
        {
          title: "Billing",
          url: "/settings/billing",
        },
        {
          title: "Limits",
          url: "/settings/limits",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "/projects/design-engineering",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "/projects/sales-marketing",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "/projects/travel",
      icon: Map,
    },
  ],
};

const AppSidebar = ({ ...props }) => {
  return (
    <Sidebar collapsible="icon" {...props}>
      {/* Header with Team Switcher */}
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>

      {/* Main Navigation Links */}
      <SidebarContent>
        <NavMain
          items={data.navMain.map((item) => ({
            ...item,
            url: item.url ? (
              <Link to={item.url}>{item.title}</Link> // Use Link for navigation
            ) : (
              item.title
            ),
            items: item.items?.map((subItem) => ({
              ...subItem,
              url: subItem.url && <Link to={subItem.url}>{subItem.title}</Link>,
            })),
          }))}
        />

        {/* Projects Section */}
        <NavProjects
          projects={data.projects.map((project) => ({
            ...project,
            url: project.url && <Link to={project.url}>{project.name}</Link>,
          }))}
        />
      </SidebarContent>

      {/* Footer with User Information */}
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>

      {/* Sidebar Rail */}
      <SidebarRail />
    </Sidebar>
  );
};
export default AppSidebar;
