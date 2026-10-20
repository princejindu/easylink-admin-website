export interface Commission {
  id: string;
  referrerId: string;
  referrerEmail: string;
  referrerName: string;
  refereeId: string;
  refereeEmail: string;
  purchaseAmount: number;
  commissionAmount: number;
  commissionPercent: number;
  /** pending | available | cancelled (older API builds send paid or reversed). */
  status: string;
  createdAt: string;
  paidAt: string | null;
  /** When a pending commission releases to available (14 days after delivery). */
  availableAt?: string | null;
}

export interface CommissionsMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CommissionsListResponse {
  data: Commission[];
  meta: CommissionsMeta;
}

export interface CommissionsListParams {
  page?: number;
  limit?: number;
}

export interface CommissionRateResponse {
  commissionPercent: number;
}

export interface ReferralWallet {
  userId: string;
  name: string;
  email: string;
  availableBalance: number;
  pendingBalance: number;
  totalEarned: number;
  totalSpent: number;
}

export interface WalletTransaction {
  id: string;
  type: string;
  amount: number;
  balanceAfter: number;
  description: string | null;
  reference: string | null;
  /** PENDING | COMPLETED | CANCELLED */
  status: string;
  availableAt: string | null;
  createdAt: string;
}

export interface PaginatedList<T> {
  data: T[];
  meta?: CommissionsMeta;
}

export interface PageParams {
  page?: number;
  limit?: number;
}

export interface ReleaseDueResponse {
  released: number;
  amount: number;
}
