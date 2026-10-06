import { AdminRole } from "@/enums/admin-role.enum";

export type AdminStatus = "active" | "inactive" | "suspended";

export interface Admin {
  id: string;
  email: string;
  fullName: string;
  role: AdminRole;
  status?: AdminStatus;
  lastLogin?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  admin: Admin;
  token: string;
}

export interface ForgotPasswordRequest {
  email: string;
}
