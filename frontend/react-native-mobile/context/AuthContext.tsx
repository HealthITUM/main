import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
//global authentication system
//what auth system contains
type AuthContextType = {
  token: string | null; //current logged in JWT token
  login: (token: string) => Promise<void>; //store token
  logout: () => Promise<void>; //remove token
};
//global storage container - will hold authentication data for whole app
const AuthContext = createContext<AuthContextType | undefined>(undefined);
//everything inside app can use authentication
export const AuthProvider = ({ children }: any) => {
  //store token in react memory, updates UI when token changes, null means not logged in
  const [token, setToken] = useState<string | null>(null);
  //runs only once when app starts
  useEffect(() => {
    const loadToken = async () => {
      //checks the device storage, returns string if token exists otherwise null
      const savedToken = await AsyncStorage.getItem("token");
      //if exists, it gets stored in state
      if (savedToken) {
        setToken(savedToken);
      }
    };

    loadToken();
  }, []);
  //when user logs in
  const login = async (newToken: string) => {
    //token stored in react state
    setToken(newToken);
    //saved permanently - even if we restart app
    await AsyncStorage.setItem("token", newToken);
  };

  const logout = async () => {
    //clears react state
    setToken(null);
    //deletes storek token - session is removed permanently
    await AsyncStorage.removeItem("token");
  };
  //global data injectior - gives every child component access to token, login and logout
  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
//hook: access auth data
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};