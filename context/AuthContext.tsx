
import React, { createContext, useContext, useState, useEffect } from 'react';

type UserRole = 'patient' | 'doctor' | null;

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  aadharNumber?: string;
  profilePicture?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, aadharNumber: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole, aadharNumber: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('ehealthwave_user');
    
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, aadharNumber: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real app, we would make an API call here
      // This is a mock implementation for demonstration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data
      const userData: User = {
        id: `user_${Math.random().toString(36).substr(2, 9)}`,
        name: email.split('@')[0],
        email,
        role: email.includes('doctor') ? 'doctor' : 'patient',
        aadharNumber,
        profilePicture: `https://ui-avatars.com/api/?name=${email.split('@')[0]}&background=random`,
      };
      
      setUser(userData);
      localStorage.setItem('ehealthwave_user', JSON.stringify(userData));
    } catch (err) {
      setError('Failed to login. Please check your credentials.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, role: UserRole, aadharNumber: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real app, we would make an API call here
      // This is a mock implementation for demonstration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data after registration
      const userData: User = {
        id: `user_${Math.random().toString(36).substr(2, 9)}`,
        name,
        email,
        role,
        aadharNumber,
        profilePicture: `https://ui-avatars.com/api/?name=${name}&background=random`,
      };
      
      setUser(userData);
      localStorage.setItem('ehealthwave_user', JSON.stringify(userData));
    } catch (err) {
      setError('Failed to register. Please try again.');
      console.error('Registration error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ehealthwave_user');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      login, 
      register, 
      logout, 
      isLoading, 
      error 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
