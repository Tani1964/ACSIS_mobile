import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import * as SecureStore from "expo-secure-store";

interface AuthState {
  token: string | null;
  authenticated: boolean;
}

interface AuthContextProps {
  authState: AuthState;
  setAuthState: React.Dispatch<React.SetStateAction<AuthState>>;
}

export const AuthContext = createContext<AuthContextProps | null>(null);

export const axi = axios.create({
  baseURL: "https://pitci-server.onrender.com/api/v1", // Replace with your actual base URL
});

export const useAuth = () => {
  return useContext(AuthContext) as AuthContextProps;
};

export const AuthProvider: React.FC = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    token: null,
    authenticated: false,
  });

  useEffect(() => {
    const loadToken = async () => {
      const token = await SecureStore.getItemAsync(authState.token);
      console.log("stored:", token);

      if (token) {
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${token}`;

        setAuthState({
          token: token,
          authenticated: true,
        });
      }
    };
    loadToken();
  }, []);
  

  return (
    <AuthContext.Provider value={{ authState, setAuthState }}>
      {children}
    </AuthContext.Provider>
  );
};
