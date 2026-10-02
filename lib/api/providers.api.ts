import { apiClient } from "./client";
import { API_ENDPOINTS } from "@/constants/api.constants";
import type { ProviderFlags } from "@/types/config.types";

export const providersApi = {
  getFlags: (): Promise<ProviderFlags> =>
    apiClient.get<ProviderFlags>(API_ENDPOINTS.PROVIDERS.FLAGS),

  updateFlags: (data: Partial<ProviderFlags>): Promise<ProviderFlags> =>
    apiClient.patch<ProviderFlags>(API_ENDPOINTS.PROVIDERS.UPDATE_FLAGS, data),
};
