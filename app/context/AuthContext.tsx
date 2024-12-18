import axios from "axios";
import * as SecureStore from "expo-secure-store";
import React, { createContext, useContext, useEffect, useState } from "react";

interface AuthState {
  token: string | null;
  authenticated: boolean;
}

interface AuthContextProps {
  authState: AuthState;
  setAuthState: React.Dispatch<React.SetStateAction<AuthState>>;
}

export const AuthContext = createContext<AuthContextProps | null>(null);

export const useAuth = () => {
  return useContext(AuthContext) as AuthContextProps;
};

// Define axios instance outside of the component
export const axi = axios.create({
  baseURL: "https://africancaribbeansummit.xyz/api/v1/",
});

export const AuthProvider: React.FC = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    token: null,
    authenticated: false,
  });

  useEffect(() => {
    const loadToken = async () => {
      try {
        const token = await SecureStore.getItemAsync("authToken");

        if (token) {
          axi.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          setAuthState({
            token: token,
            authenticated: true,
          });
        } else {
          console.log("No token found.");
        }
      } catch (error) {
        console.error("Error loading token:", error);
      }
    };
    loadToken();
  }, []);

  useEffect(() => {
    // Dynamically update axios headers whenever authState changes
    if (authState.token) {
      axi.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${authState.token}`;
    } else {
      delete axi.defaults.headers.common["Authorization"];
    }
  }, [authState.authenticated]);

  return (
    <AuthContext.Provider value={{ authState, setAuthState }}>
      {children}
    </AuthContext.Provider>
  );
};
