export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string | null;
  bio?: string | null;
  city?: string | null;
  role: UserRole;
  isBlocked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type UserProfile = User;

export interface UserSession {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  isBlocked: boolean;
}
