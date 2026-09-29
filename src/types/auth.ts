export type UserRole = "owner" | "manager" | "barista";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface SessionData {
  user: AuthUser;
  expiresAt: string;
}

export interface LoginResult {
  success: boolean;
  error?: string;
  user?: AuthUser;
}
