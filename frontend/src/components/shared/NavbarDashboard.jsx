import AvatarDropDown from "./AvatarDropDown";

const NavbarDashboard = () => {
  return (
    <div className=" shadow-md bg-white z-50">
      <nav className=" max-w-7xl mx-auto ">
        <div className="container mx-auto flex justify-end items-center p-4">
            <AvatarDropDown />
        </div>
      </nav>
    </div>
  );
};

export default NavbarDashboard;
