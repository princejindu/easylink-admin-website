import { apiClient } from "./client";
import { API_ENDPOINTS } from "@/constants/api.constants";
import { UserStatus } from "@/enums/user-status.enum";
import type {
  User,
  UsersListResponse,
  UsersListParams,
  SuspendUserResponse,
  ActivateUserResponse,
  PagedItems,
  UserPageParams,
  UserNotification,
  UserWalletTransaction,
  UserReferredFriend,
  UserCommission,
  UserPurchaseRow,
} from "@/types/user.types";
import type { Purchase, PurchasesListResponse } from "@/types/purchase.types";

type RawPage<T> = {
  items?: T[];
  data?: T[];
  total?: number;
  meta?: { total?: number };
} | null;

/** Accepts { items, total } or { data, meta: { total } } so either API shape works. */
function toPagedItems<T>(response: RawPage<T> | T[]): PagedItems<T> {
  if (Array.isArray(response)) return { items: response, total: response.length };
  const items = response?.items ?? response?.data ?? [];
  const list = Array.isArray(items) ? items : [];
  return {
    items: list,
    total: Number(response?.total ?? response?.meta?.total ?? list.length),
  };
}

async function getPage<T>(endpoint: string, params: UserPageParams): Promise<PagedItems<T>> {
  const query: Record<string, unknown> = { page: params.page, limit: params.limit };
  if (params.status) query.status = params.status;
  if (params.type) query.type = params.type;
  return toPagedItems(await apiClient.get<RawPage<T> | T[]>(endpoint, query));
}

function purchaseToRow(p: Purchase): UserPurchaseRow {
  return {
    id: p.id,
    packageName: p.packageName,
    price: p.amount,
    currency: p.currency,
    status: p.status,
    paymentMethod: p.paymentMethod ?? null,
    isTopup: p.isTopup ?? null,
    topupOf: p.topupOf ?? null,
    validityState: p.validityState ?? null,
    purchasedAt: p.createdAt,
  };
}

type ApiUsersListResponse = {
  data: Array<Partial<User> & { fullName?: string; phoneNumber?: string }>;
  meta: { total: number; page: number; limit: number; totalPages?: number };
};

function normalizeUser(raw: Partial<User> & { fullName?: string; phoneNumber?: string }): User {
  const fullName =
    raw.fullName ??
    `${raw.firstName ?? ""} ${raw.lastName ?? ""}`.trim();
  const parts = fullName.split(" ").filter(Boolean);
  const createdAt = raw.createdAt ?? new Date().toISOString();

  return {
    // Keep every other field the API sends (wallet, time zone, recent purchases and so on).
    ...raw,
    id: String(raw.id ?? ""),
    email: raw.email ?? "",
    fullName,
    firstName: raw.firstName ?? parts[0] ?? "",
    lastName: raw.lastName ?? parts.slice(1).join(" "),
    phone: raw.phone ?? (raw.phoneNumber as string | undefined),
    status: raw.status ?? UserStatus.ACTIVE,
    country: raw.country,
    referralCode: raw.referralCode,
    totalSpend: raw.totalSpend,
    purchaseCount: raw.purchaseCount,
    referralBalance: raw.referralBalance,
    createdAt,
    updatedAt: raw.updatedAt ?? createdAt,
  };
}

export const usersApi = {
  list: async (params?: UsersListParams): Promise<UsersListResponse> => {
    const response = await apiClient.get<ApiUsersListResponse>(
      API_ENDPOINTS.USERS.LIST,
      params as Record<string, unknown>
    );

    const users = Array.isArray(response?.data)
      ? response.data.map(normalizeUser)
      : [];

    return {
      data: users,
      meta: {
        total: response?.meta?.total ?? users.length,
        page: response?.meta?.page ?? params?.page ?? 1,
        limit: response?.meta?.limit ?? params?.limit ?? 20,
        totalPages: response?.meta?.totalPages ?? 1,
      },
    };
  },

  detail: async (id: string): Promise<User> => {
    const response = await apiClient.get<Partial<User> & { fullName?: string; phoneNumber?: string }>(
      API_ENDPOINTS.USERS.DETAIL(id)
    );
    return normalizeUser(response);
  },

  suspend: (id: string, reason?: string): Promise<SuspendUserResponse> =>
    apiClient.patch<SuspendUserResponse>(API_ENDPOINTS.USERS.SUSPEND(id), {
      reason,
    }),

  activate: (id: string): Promise<ActivateUserResponse> =>
    apiClient.patch<ActivateUserResponse>(API_ENDPOINTS.USERS.ACTIVATE(id)),

  notifications: (id: string, params: UserPageParams) =>
    getPage<UserNotification>(API_ENDPOINTS.USERS.NOTIFICATIONS(id), params),

  walletTransactions: (id: string, params: UserPageParams) =>
    getPage<UserWalletTransaction>(API_ENDPOINTS.USERS.WALLET_TRANSACTIONS(id), params),

  referrals: (id: string, params: UserPageParams) =>
    getPage<UserReferredFriend>(API_ENDPOINTS.USERS.REFERRALS(id), params),

  commissions: (id: string, params: UserPageParams) =>
    getPage<UserCommission>(API_ENDPOINTS.USERS.COMMISSIONS(id), params),

  /** Uses the per user endpoint, or the purchase list filtered by user on API builds without it. */
  purchases: async (id: string, params: UserPageParams): Promise<PagedItems<UserPurchaseRow>> => {
    try {
      return await getPage<UserPurchaseRow>(API_ENDPOINTS.USERS.PURCHASES(id), params);
    } catch (err: unknown) {
      if ((err as { statusCode?: number })?.statusCode !== 404) throw err;
      const response = await apiClient.get<PurchasesListResponse>(API_ENDPOINTS.PURCHASES.LIST, {
        userId: id,
        page: params.page,
        limit: params.limit,
      });
      const list = response?.data ?? [];
      return { items: list.map(purchaseToRow), total: response?.meta?.total ?? list.length };
    }
  },
};
