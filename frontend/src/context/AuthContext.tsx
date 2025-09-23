import { createContext, useState, useContext, ReactNode } from 'react';
import { api } from '../services/api';

// Define the shape of our context data
interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// This is our provider component. It will wrap our entire app.
export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

  const login = async (email: string, password: string) => {
    try {
      const response = await api.login(email, password);
      const { token: newToken } = response;
      localStorage.setItem('token', newToken); // Store the token
      setToken(newToken);
    } catch (error) {
      console.error("Login failed:", error);
      // We re-throw the error so the login page can catch it and show a message
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  const value = {
    token,
    isAuthenticated: !!token, // A simple check: if there's a token, we're authenticated
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// A handy custom hook to easily access the auth context from any component
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
