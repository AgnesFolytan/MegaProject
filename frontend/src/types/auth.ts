export enum UserType {
  customer,
  admin,
  deleted
}

export interface User {
  id: number;
  username: string;
  email: string;
  userType: UserType;
  token: string;

}

export interface Permissions {
  canManageUsers: boolean;
  canAccessDashboard: boolean;
}

export interface AuthContextType {
  user: User | null;
  permissions: Permissions;
  login: (username: string, email: string, userType: UserType) => void;
  validate: () => void;
  logout: () => void;
}