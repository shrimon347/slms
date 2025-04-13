import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useAuth from "@/hooks/useAuth";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { LogOut, User } from "lucide-react";
import { Link } from "react-router";
import { Avatar } from "../ui/avatar";

const AvatarDropDown = () => {
  const { user, handleLogout } = useAuth();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center gap-3 cursor-pointer">
          <Avatar className="border">
            <AvatarImage
              src={user?.profile_image_url || "https://github.com/shadcn.png"}
              alt={user?.full_name || "User"}
            />
            <AvatarFallback className="flex items-center justify-center w-full h-full">
              {user?.full_name?.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <div className="flex items-center gap-2">
          <Avatar className="border">
            <AvatarImage
              src={user?.profile_image_url || "https://github.com/shadcn.png"}
              alt={user?.full_name || "User"}
            />
          </Avatar>
          <DropdownMenuLabel>
            {user?.full_name}
            <p>{user?.contact_number}</p>
          </DropdownMenuLabel>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link to="/dashboard/profile/">
            <DropdownMenuItem className="cursor-pointer">
              <User />
              <span>Profile</span>
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AvatarDropDown;
