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

export interface User extends UserExtras {
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

export interface UserWallet {
  availableBalance?: number | null;
  pendingBalance?: number | null;
  currency?: string | null;
  lifetimeEarned?: number | null;
  lifetimeSpent?: number | null;
  lifetimeAdjusted?: number | null;
  nextReleaseAt?: string | null;
  nextReleaseAmount?: number | null;
}

export interface UserRef {
  id: string;
  name?: string | null;
  email?: string | null;
}

export interface ReferredBy extends UserRef {
  code?: string | null;
}

/** Fields added for wallets, referrals and time zones. All optional so older API builds still work. */
export interface UserExtras {
  timezoneMode?: string | null;
  timezone?: string | null;
  deviceTimezone?: string | null;
  effectiveTimezone?: string | null;
  wallet?: UserWallet | null;
  referredBy?: ReferredBy | null;
  selfReferralBlocks?: unknown;
}

export interface PagedItems<T> {
  items: T[];
  total: number;
}

export interface UserPageParams {
  page: number;
  limit: number;
  status?: string;
  type?: string;
}

export interface UserNotification {
  id: string;
  type?: string | null;
  title?: string | null;
  body?: string | null;
  isRead?: boolean | null;
  readAt?: string | null;
  pushStatus?: string | null;
  pushError?: string | null;
  entityType?: string | null;
  entityId?: string | null;
  createdAt?: string | null;
}

export interface PurchaseSummary {
  id: string;
  packageName?: string | null;
  price?: number | null;
  currency?: string | null;
  paymentMethod?: string | null;
  isTopup?: boolean | null;
}

export interface UserWalletTransaction {
  id: string;
  type?: string | null;
  status?: string | null;
  amount?: number | null;
  currency?: string | null;
  createdAt?: string | null;
  availableAt?: string | null;
  daysUntilAvailable?: number | null;
  releasedAt?: string | null;
  sourceUser?: UserRef | null;
  purchase?: PurchaseSummary | null;
  commissionId?: string | null;
  note?: string | null;
}

export interface UserReferredFriend {
  user?: (UserRef & { createdAt?: string | null }) | null;
  purchasesCount?: number | null;
  totalSpent?: number | null;
  commissionEarned?: number | null;
  commissionPending?: number | null;
  commissionAvailable?: number | null;
  lastPurchaseAt?: string | null;
}

export interface UserCommission {
  id: string;
  amount?: number | null;
  currency?: string | null;
  paidAt?: string | null;
  reversedAt?: string | null;
  reversedAmount?: number | null;
  rate?: number | null;
  status?: string | null;
  createdAt?: string | null;
  availableAt?: string | null;
  daysUntilAvailable?: number | null;
  sourceUser?: UserRef | null;
  purchase?: PurchaseSummary | null;
}

export interface UserPurchaseRow {
  id: string;
  packageName?: string | null;
  price?: number | null;
  currency?: string | null;
  status?: string | null;
  paymentMethod?: string | null;
  isTopup?: boolean | null;
  topupOf?: { id: string; packageName?: string | null } | null;
  validityState?: string | null;
  purchasedAt?: string | null;
}
