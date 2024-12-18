import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { User, Permissions, AuthContextType, UserType } from '../types/auth';
import {  } from 'react-router';
export const Context = createContext<AuthContextType>({
  user: null,
  permissions: {
    canManageUsers: false,
    canAccessDashboard: false,
  },
  login: () => { },
  logout: () => { },
  validate: () => { },
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [permissions, setPermissions] = useState<Permissions>({
    canManageUsers: false,
    canAccessDashboard: false,
  });
  const [isLoggedOut, setIsLoggedOut] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  

  useEffect(() => {
    const loadToken = async () => {
      const token = localStorage.getItem('authToken');
      if (token && !isLoggedOut) {
        try {
          const response = await fetch('http://localhost:3000/users', {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok) throw new Error('Token validation failed');

          const data = await response.json();
          setUser({
            id: data.id,
            username: data.userName,
            email: data.email,
            userType: data.userType,
            token,
          });
          setPermissions({
            canManageUsers: data.userType === UserType.admin,
            canAccessDashboard: data.userType === UserType.admin,
          });
        } catch (error) {
          console.error('Validation error:', error);
          localStorage.removeItem('authToken');
          setUser(null);
        }
      }
    };

    loadToken();
  }, [isLoggedOut]);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('http://localhost:3000/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });


      const data = await response.json();
      console.log(data)
      setUser(data);

      localStorage.setItem("authToken", data.token);

      await validate();

      setPermissions({
        canManageUsers: data.userType === UserType.admin,
        canAccessDashboard: data.userType === UserType.admin,
      });

      localStorage.setItem('authToken', data.token);

    } catch (error: any) {
      console.error('Login error:', error);
      alert(error.message);
    }
  };

  const validate = async () => {
    if (isLoggedOut || isValidating) return;
    setIsValidating(true);

    try {
      const token = user?.token || localStorage.getItem('authToken');
      if (!token) return;

      const response = await fetch('http://localhost:3000/users', {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Validation failed');
      console.log("hi")
      const data = await response.json();
      console.log(data.token)
      setUser({
        id: data.id,
        username: data.userName,
        email: data.email,
        token,
        userType: data.userType,
      });
      setPermissions({
        canManageUsers: data.userType === UserType.admin,
        canAccessDashboard: data.userType === UserType.admin,
      });
    } catch (error) {
      console.log('Validation error:' + error);
      localStorage.removeItem('authToken');
      setUser(null);
    } finally {
      setIsValidating(false);
    }
  };

  const logout = () => {
    setIsLoggedOut(true);
    setUser(null);
    setPermissions({
      canManageUsers: false,
      canAccessDashboard: false,
    });
    localStorage.removeItem('authToken');
    
  };

  return (
    <Context.Provider value={{ user, permissions, login, logout, validate }}>
      {children}
    </Context.Provider>
  );
};
