export enum UserType {
  customer,
  admin,
  deleted
}

export interface User {
    username: string;
    email: string;
    userType: UserType;
    
  }
  
export interface Permissions {
    canManageUsers: boolean;
    canAccessDashboard: boolean;
  }
  
  export interface AuthContextType {
    user: User | null;
    permissions: Permissions;
    login: (username: string, email: string, userType: UserType) => void;
    logout: () => void;
  }