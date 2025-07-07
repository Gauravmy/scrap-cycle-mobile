
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  phone: string;
  name: string;
  type: 'customer' | 'partner';
}

interface AuthContextType {
  user: User | null;
  login: (phone: string, otp: string, type: 'customer' | 'partner') => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate checking stored session
    const storedUser = localStorage.getItem('scrapPickupUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (phone: string, otp: string, type: 'customer' | 'partner'): Promise<boolean> => {
    // Mock OTP validation - accept 123456
    if (otp === '123456') {
      const newUser: User = {
        id: Date.now().toString(),
        phone,
        name: type === 'customer' ? 'John Doe' : 'Partner Smith',
        type
      };
      setUser(newUser);
      localStorage.setItem('scrapPickupUser', JSON.stringify(newUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('scrapPickupUser');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
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
