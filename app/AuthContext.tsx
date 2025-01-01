import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { BASE_URL } from './url';

interface AuthProps {
  authState: { token: string | null; authenticated: boolean | null };
  onRegister: (email: string,username:string, password: string) => Promise<any>;
  onLogin: (email: string) => Promise<any>;
  onLogout: () => Promise<any>;
}

const TOKEN_KEY = 'my-jwt';
export const API_URL = BASE_URL;

const AuthContext = createContext<AuthProps | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

export const AuthProvider = ({ children }: any) => {
  const [authState, setAuthState] = useState<{
    token: string | null;
    authenticated: boolean | null;
  }>({
    token: null,
    authenticated: false,
  });
  

  useEffect(() => {
    const loadToken = async () => {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      console.log("Token: ", token);

      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setAuthState({
          token: token,
          authenticated: true,
        });
      }
    };

    loadToken();
  }, []);

  const register = async (email: string, password: string, username: string) => {
    try {
      return await axios.post(`${API_URL}/register`, { email, password, username });
    } catch (e) {
      return { error: true, msg: (e as any).response?.data?.msg || "Registration failed" };
    }
  };

  const login = async (email: string) => {
    try {
      console.log("Inside login in AuthContext.tsx! ");
      
      const result = await axios.post(`${API_URL}/login`, { email });
      console.log("Result from login: ", result);

      axios.defaults.headers.common['Authorization'] = `Bearer ${result.data.token}`;
      setAuthState({
        token: result.data.token,
        authenticated: true,
      });

      await SecureStore.setItemAsync(TOKEN_KEY, result.data.token);
      return result;
    } catch (e) {
      return { error: true, msg: (e as any).response?.data?.msg || "Login failed" };
    }
  };

  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      setAuthState({
        token: null,
        authenticated: false,
      });
    } catch (e) {
      return { error: true, msg: (e as any).response?.data?.msg || "Logout failed" };
    }
  };

  const value = { authState, onRegister: register, onLogin: login, onLogout: logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
