import { useDispatch, useSelector } from "react-redux";
import { useLogoutMutation } from "../features/auth/authApi";
import { logOut } from "../features/auth/authSlice";
import { clearAuthData } from "../utils/localStorage";

const useAuth = () => {
  const dispatch = useDispatch();
  const { user, accessToken } = useSelector((state) => state.auth);
  const [logout] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      dispatch(logOut());
      clearAuthData();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return { user, accessToken, handleLogout };
};

export default useAuth;
