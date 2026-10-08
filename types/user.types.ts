import { UserStatus } from "@/enums/user-status.enum";
import { SortOrder } from "@/enums/sort-order.enum";

export interface RecentPurchase {
  id: string;
  packageName: string;
  amount: number;
  status: string;
  provider: string;
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  status: UserStatus;
  country?: string;
  referralCode?: string;
  totalSpend?: number;
  purchaseCount?: number;
  referralBalance?: number;
  referralCount?: number;
  createdAt: string;
  lastLoginAt?: string | null;
  updatedAt?: string;
  suspendedAt?: string | null;
  suspendReason?: string | null;
  recentPurchases?: RecentPurchase[];
}

export interface UsersListResponse {
  data: User[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface UsersListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: UserStatus;
  sortOrder?: SortOrder;
}

export interface SuspendUserResponse {
  id: string;
  status: string;
  suspendedAt: string;
  suspendReason: string;
}

export interface ActivateUserResponse {
  id: string;
  status: string;
  suspendedAt: null;
  suspendReason: null;
}
