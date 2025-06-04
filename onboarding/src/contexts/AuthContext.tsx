import { createContext, useContext, useState, ReactNode } from "react";
import { login as apiLogin, signup as apiSignup } from "../utils/api";
import { useNavigate } from "react-router-dom";

// Types
interface User {
  id: string;
  email: string;
  name: string;
  role: 'TRAINER' | 'TRAINEE';
  avatar?: string;
  firstName?: string;
  lastName?: string;
  department?: string;
  joinedDate?: string;
}

interface AuthContextType {
  currentUser: User | null;
  login: (credentials: { email: string; password: string }) => Promise<{ success: boolean; error?: string }>;
  signup: (userData: { email: string; password: string; name: string; role: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isTrainer: () => boolean;
  isTrainee: () => boolean;
  loading: boolean;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const login = async (credentials: { email: string; password: string }) => {
    setLoading(true);
    try {
      const response = await apiLogin(credentials);
      const user = response.data;
      setCurrentUser(user);
      navigate(user.role === "TRAINER" ? "/trainer" : "/trainee");
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Login failed",
      };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData: { email: string; password: string; name: string; role: string }) => {
    setLoading(true);
    try {
      const response = await apiSignup(userData);
      const user = response.data;
      setCurrentUser(user);
      navigate(user.role === "TRAINER" ? "/trainer" : "/trainee");
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Signup failed",
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    navigate("/login");
  };

  const isTrainer = () => currentUser?.role === 'TRAINER';
  const isTrainee = () => currentUser?.role === 'TRAINEE';

  return (
    <AuthContext.Provider value={{ currentUser, login, signup, logout, isTrainer, isTrainee, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};