import { apiClient } from "./client";
import { API_ENDPOINTS } from "@/constants/api.constants";
import type { User, UsersListResponse, UsersListParams } from "@/types/user.types";

type ApiUsersListResponse = {
  data: Array<Partial<User> & { fullName?: string }>;
  meta: { total: number; page: number; limit: number; totalPages?: number };
};

function normalizeUser(user: Partial<User> & { fullName?: string }): User {
  const rawName = user.fullName ?? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();
  const parts = rawName.split(" ").filter(Boolean);
  const createdAt = user.createdAt ?? new Date().toISOString();

  return {
    id: String(user.id ?? ""),
    firstName: parts[0] ?? "",
    lastName: parts.slice(1).join(" "),
    email: user.email ?? "",
    phoneNumber: user.phoneNumber,
    status: (user.status ?? "active") as User["status"],
    country: user.country,
    referralCode: user.referralCode,
    totalSpend: user.totalSpend,
    purchaseCount: (user as any).purchaseCount,
    referralBalance: user.referralBalance,
    createdAt,
    updatedAt: user.updatedAt ?? createdAt,
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
      users,
      total: response?.meta?.total ?? users.length,
      page: response?.meta?.page ?? params?.page ?? 1,
      limit: response?.meta?.limit ?? params?.limit ?? 20,
    };
  },

  detail: async (id: string): Promise<User> => {
    const response = await apiClient.get<Partial<User> & { fullName?: string }>(
      API_ENDPOINTS.USERS.DETAIL(id)
    );
    return normalizeUser(response);
  },

  suspend: (id: string): Promise<User> =>
    apiClient.patch<User>(API_ENDPOINTS.USERS.SUSPEND(id)),

  activate: (id: string): Promise<User> =>
    apiClient.patch<User>(API_ENDPOINTS.USERS.ACTIVATE(id)),
};
