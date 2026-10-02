import { UserStatus } from "@/enums/user-status.enum";
import { SortOrder } from "@/enums/sort-order.enum";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  status: UserStatus;
  country?: string;
  referralCode?: string;
  totalSpend?: number;
  referralBalance?: number;
  createdAt: string;
  updatedAt: string;
}

export interface UsersListResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
}

export interface UsersListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: UserStatus;
  sortOrder?: SortOrder;
}
