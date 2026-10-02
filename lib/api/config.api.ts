import { apiClient } from "./client";
import { API_ENDPOINTS } from "@/constants/api.constants";
import type { SystemConfig } from "@/types/config.types";

export const configApi = {
  get: (): Promise<SystemConfig> =>
    apiClient.get<SystemConfig>(API_ENDPOINTS.CONFIG.GET),

  update: (data: Partial<SystemConfig>): Promise<SystemConfig> =>
    apiClient.patch<SystemConfig>(API_ENDPOINTS.CONFIG.UPDATE, data),
};
