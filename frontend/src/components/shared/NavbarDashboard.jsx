import { Link } from "react-router";
import AvatarDropDown from "./AvatarDropDown";

const NavbarDashboard = () => {
  return (
    <div className=" shadow-md bg-white z-50">
      <nav className=" max-w-full mx-auto ">
        <div className="container mx-auto flex justify-between items-center p-4">
          <Link to="/" className="relative cursor-pointer transition-all text-gray-700 after:block after:content-[''] after:absolute after:w-full after:h-[2px] after:bg-slate-600 after:bottom-0 after:left-0 after:scale-x-0 after:origin-left after:transition-transform after:duration-300 hover:after:scale-x-100 cursor-pointer">Home</Link>
          <AvatarDropDown />
        </div>
      </nav>
    </div>
  );
};

export default NavbarDashboard;
