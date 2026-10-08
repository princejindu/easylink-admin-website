import { apiClient } from "./client";
import { API_ENDPOINTS } from "@/constants/api.constants";
import { UserStatus } from "@/enums/user-status.enum";
import type {
  User,
  UsersListResponse,
  UsersListParams,
  SuspendUserResponse,
  ActivateUserResponse,
} from "@/types/user.types";

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
};
