import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, NavLink } from "react-router";

const navItems = [
  { name: "Home", path: "/" },
  { name: "Courses", path: "/courses" },
  { name: "About", path: "/about" },
  { name: "Contact", path: "/contact" },
];

const NavItem = ({ name, path, closeMenu }) => (
  <NavLink
    to={path}
    className={({ isActive }) =>
      `relative cursor-pointer transition-all ${
        isActive
          ? "text-blue-600 after:block after:content-[''] after:absolute after:w-full after:h-[2px] after:bg-blue-600 after:bottom-0 after:left-0"
          : "text-gray-700 after:block after:content-[''] after:absolute after:w-full after:h-[2px] after:bg-blue-600 after:bottom-0 after:left-0 after:scale-x-0 after:origin-left after:transition-transform after:duration-300 hover:after:scale-x-100"
      }`
    }
    onClick={closeMenu}
  >
    {name}
  </NavLink>
);

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <div className=" shadow-md bg-white z-50">
      <nav className=" max-w-7xl mx-auto ">
        <div className="container mx-auto flex justify-between items-center p-4">
          <div className="text-xl font-bold">Brand</div>
          <div className="hidden md:flex space-x-6">
            {navItems.map(({ name, path }) => (
              <NavItem
                key={name}
                name={name}
                path={path}
                closeMenu={closeMenu}
              />
            ))}
          </div>
          <Link to={"login"}>
            <Button className="hidden md:block cursor-pointer">
              Login / Signup
            </Button>
          </Link>
          <div className="md:hidden flex items-center">
            <Link to={"login"}>
              <Button className="mr-4 cursor-pointer">Login / Signup</Button>
            </Link>
            <Menu size={24} onClick={toggleMenu} className="cursor-pointer" />
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`fixed top-0 right-0 h-full bg-white shadow-lg w-64 transform ${
            isOpen ? "translate-x-0" : "translate-x-full"
          } transition-transform duration-300 ease-in-out`}
        >
          <div className="flex justify-end p-4">
            <X size={24} onClick={toggleMenu} className="cursor-pointer" />
          </div>
          <div className="flex flex-col space-y-6 p-6">
            {navItems.map(({ name, path }) => (
              <NavItem
                key={name}
                name={name}
                path={path}
                closeMenu={closeMenu}
              />
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
