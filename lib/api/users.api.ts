import { apiClient } from "./client";
import { API_ENDPOINTS } from "@/constants/api.constants";
import type { User, UsersListResponse, UsersListParams } from "@/types/user.types";

export const usersApi = {
  list: (params?: UsersListParams): Promise<UsersListResponse> =>
    apiClient.get<UsersListResponse>(API_ENDPOINTS.USERS.LIST, params as Record<string, unknown>),

  detail: (id: string): Promise<User> =>
    apiClient.get<User>(API_ENDPOINTS.USERS.DETAIL(id)),

  suspend: (id: string): Promise<User> =>
    apiClient.patch<User>(API_ENDPOINTS.USERS.SUSPEND(id)),

  activate: (id: string): Promise<User> =>
    apiClient.patch<User>(API_ENDPOINTS.USERS.ACTIVATE(id)),
};
