import { apiClient } from "./client";
import { API_ENDPOINTS } from "@/constants/api.constants";
import type { ProviderFlags } from "@/types/config.types";

export const providersApi = {
  getFlags: async (): Promise<ProviderFlags> => {
    const response = await apiClient.get<ProviderFlags>(
      API_ENDPOINTS.PROVIDERS.FLAGS
    );
    return response;
  },

  updateFlags: async (
    provider: "telna" | "transatel",
    flags: Partial<ProviderFlags["providers"][number]["flags"]>
  ): Promise<ProviderFlags> => {
    const response = await apiClient.patch<ProviderFlags>(
      API_ENDPOINTS.PROVIDERS.UPDATE_FLAGS(provider),
      flags
    );
    return response;
  },
};
