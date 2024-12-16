import React, { createContext, useState, ReactNode } from 'react';
import { User, Permissions, AuthContextType, UserType } from '../types/auth';

export const Context = createContext<AuthContextType>({
  user: null,
  permissions: {
    canManageUsers: false,
    canAccessDashboard: false
  },
  login: () => {},
  logout: () => {}
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [permissions, setPermissions] = useState<Permissions>({
    canManageUsers: false,
    canAccessDashboard: false
  });

  const login = (username: string, email: string, userType: UserType) => {
    const thisUser: User = {
      username, email,
      userType
    };
    setUser(thisUser)
    if (userType === UserType.deleted) {
      setUser(null)
    }
    setPermissions({
      canManageUsers: userType === UserType.admin,
      canAccessDashboard: userType === UserType.admin
    });
  };

  const logout = () => {
    setUser(null);
    setPermissions({
      canManageUsers: false,
      canAccessDashboard: false
    });
  };

  return (
    <Context.Provider value={{ user, permissions, login, logout }}>
      {children}
    </Context.Provider>
  );
};