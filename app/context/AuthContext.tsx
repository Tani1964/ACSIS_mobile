import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import * as SecureStore from "expo-secure-store";

interface AuthState {
  token: string | null;
  authenticated: boolean;
}

interface AuthContextProps {
  authState: AuthState;
  setAuthState: (sate: any)=> void;
  // onRegister: (email: string, fullName: string, password: string) => Promise<any>;
  // onLogin: (email: string, password: string) => Promise<any>;
  // onLogout: () => Promise<void>;
}

const TOKEN_KEY = "my_jwt";
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

  return (
    <AuthContext.Provider value={{ authState, setAuthState}}>
      {children}
    </AuthContext.Provider>
  );
};
