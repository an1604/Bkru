import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../constants/url';

interface AuthProps {
  authState: { token: string | null; authenticated: boolean | null };
  onRegister: (email: string, username: string, password: string) => Promise<any>;
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

// Abstracted storage utility functions
const isWeb = Platform.OS === 'web';

const setItem = async (key: string, value: string) => {
  if (isWeb) {
    await AsyncStorage.setItem(key, value);
  } else {
    await SecureStore.setItemAsync(key, value);
  }
};

const getItem = async (key: string) => {
  if (isWeb) {
    return await AsyncStorage.getItem(key);
  } else {
    return await SecureStore.getItemAsync(key);
  }
};

const deleteItem = async (key: string) => {
  if (isWeb) {
    await AsyncStorage.removeItem(key);
  } else {
    await SecureStore.deleteItemAsync(key);
  }
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [authState, setAuthState] = useState<{
    token: string | null;
    authenticated: boolean | null;
  }>({
    token: null,
    authenticated: false,
  });

  useEffect(() => {
    const loadToken = async () => {
      const token = await getItem(TOKEN_KEY);
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

  const register = async (email: string, username: string, password: string) => {
    try {
      return await axios.post(`${API_URL}/register`, { email, username, password });
    } catch (e) {
      return { error: true, msg: (e as any).response?.data?.msg || "Registration failed" };
    }
  };

  const login = async (email: string) => {
    try {
      console.log("Inside login in AuthContext.tsx!");

      const result = await axios.post(`${API_URL}/login`, { email });
      console.log("Result from login: ", result);

      axios.defaults.headers.common['Authorization'] = `Bearer ${result.data.token}`;
      setAuthState({
        token: result.data.token,
        authenticated: true,
      });

      await setItem(TOKEN_KEY, result.data.token);
      return result;
    } catch (e) {
      return { error: true, msg: (e as any).response?.data?.msg || "Login failed" };
    }
  };

  const logout = async () => {
    try {
      await deleteItem(TOKEN_KEY);
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
