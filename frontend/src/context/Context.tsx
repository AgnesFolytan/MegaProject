import React, { createContext, useState, ReactNode } from 'react';
import { User, AuthContextType } from '../types/auth';

export const Context = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {}
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  

  const login = (username: string) => {
    const newUser: User = { username };
    setUser(newUser);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <Context.Provider value={{ user, login, logout }}>
      {children}
    </Context.Provider>
  );
};