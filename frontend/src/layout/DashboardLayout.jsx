import { AppSidebar } from "@/components/app-sidebar";
import NavbarDashboard from "@/components/shared/NavbarDashboard";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Outlet } from "react-router";
import { Toaster } from "sonner";

const DashboardLayout = () => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1 bg-gray-100">
        <div className="relative">
          <SidebarTrigger className="absolute top-5" />
          <NavbarDashboard />
        </div>
        <Outlet />
        <Toaster richColors position="top-right" />
      </main>
    </SidebarProvider>
  );
};

export default DashboardLayout;
