import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  type JSX,
} from "react";
import type { IAuthContext } from "../common/types";
import axios from "axios";

const authContext = createContext<IAuthContext>({
  authenticated: false,
  loading: true,
  userData: null,
  refreshAuth: () => {},
});

const AuthProvider: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [userData, setUserData] = useState<IAuthContext["userData"]>(null);

  const checkAuthenticate = async () => {
    try {
      const currentUser = await axios.get(
        "http://localhost:3000/users/currentUser",
        {
          withCredentials: true,
        }
      );
      setAuthenticated(true);
      setUserData(currentUser.data);
      console.log(userData);
    } catch {
      setAuthenticated(false);
      setUserData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuthenticate();
  }, []);

  return (
    <>
      <authContext.Provider
        value={{
          authenticated,
          loading,
          userData,
          refreshAuth: checkAuthenticate,
        }}
      >
        {children}
      </authContext.Provider>
    </>
  );
};

export default AuthProvider;

export const useAuth = () => useContext(authContext)!;
