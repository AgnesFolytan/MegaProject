import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { User, Permissions, AuthContextType, UserType } from '../types/auth';
import { useNavigate } from 'react-router';
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
  const navigate = useNavigate();

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

  const login = async (email: string) => {
    try {
      const response = await fetch('http://localhost:3000/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) throw new Error('Login failed');

      const data = await response.json();
      const { token, username, email: userEmail, userType, userId } = data;

      setUser({
        id: userId,
        token,
        username,
        email: userEmail,
        userType,
      });

      setPermissions({
        canManageUsers: userType === UserType.admin,
        canAccessDashboard: userType === UserType.admin,
      });

      localStorage.setItem('authToken', token);

      navigate('/account');
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

      const data = await response.json();
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
      console.error('Validation error:', error);
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
    navigate('/login');
  };

  return (
    <Context.Provider value={{ user, permissions, login, logout, validate }}>
      {children}
    </Context.Provider>
  );
};
