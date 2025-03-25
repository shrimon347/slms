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
          <p>{user?.full_name || "Guest"}</p>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <User />
            <span>Profile</span>
          </DropdownMenuItem>
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
