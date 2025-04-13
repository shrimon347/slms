import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";
import { Outlet } from "react-router";
import { Toaster } from "sonner";

const Mainlayout = () => {
  return (
    <div>
      <Navbar />
      <Outlet />
      <Footer />
      <Toaster richColors position="top-right" />
    </div>
  );
};

export default Mainlayout;
