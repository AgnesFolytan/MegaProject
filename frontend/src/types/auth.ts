export interface User {
    username: string;

  }
  
  export interface Permissions {
    canManageUsers: boolean;
    canAccessDashboard: boolean;
  }
  
  export interface AuthContextType {
    user: User | null;
    login: (username: string) => void;
    logout: () => void;
  }