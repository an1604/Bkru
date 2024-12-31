import React, { createContext, useState, useEffect, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
  refreshToken: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const BASE_URL = 'http://192.168.1.154:3000'; 

  useEffect(() => {
    const checkToken = async () => {
      const token = await SecureStore.getItemAsync('authToken');

      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setIsAuthenticated(true);
      }
    };
    checkToken();
  }, []);

  const login = async (token: string) => {
    console.log('Logging in user');
    await SecureStore.setItemAsync('authToken', token);

    // Update Axios default authorization header
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    setIsAuthenticated(true);
    console.log('Login complete');
  };

  const logout = async () => {
    console.log('Logging out user');
    await SecureStore.deleteItemAsync('authToken');

    // Remove the Axios default authorization header
    delete axios.defaults.headers.common['Authorization'];

    setIsAuthenticated(false);
    console.log('Logout complete');
  };

  const refreshToken = async () => {
    try {
      console.log('Refreshing token...');

      // Get the current token from SecureStore
      const currentToken = await SecureStore.getItemAsync('authToken');

      // Make the POST request using axios
      const response = await axios.post(`${BASE_URL}/refresh_token`, { token: currentToken });

      // Extract the new token from the response
      const newToken = response.data.token;

      // Save the new token in SecureStore
      await SecureStore.setItemAsync('authToken', newToken);

      // Update the Axios default authorization header
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

      setIsAuthenticated(true);
      console.log('Token refreshed successfully');
    } catch (error) {
      console.error('Error refreshing token:', error);
      setIsAuthenticated(false);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, refreshToken }}>
      {children}
    </AuthContext.Provider>
  );
};
