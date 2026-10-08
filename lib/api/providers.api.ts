import { apiClient } from "./client";
import { API_ENDPOINTS } from "@/constants/api.constants";
import type { ProviderFlags, ProvidersResponse } from "@/types/config.types";

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

  getProviders: (): Promise<ProvidersResponse> =>
    apiClient.get<ProvidersResponse>(API_ENDPOINTS.PROVIDERS.LIST),

  updateProviderFlags: (
    provider: "telna" | "transatel",
    data: { catalog?: boolean; purchase?: boolean; statusSync?: boolean }
  ): Promise<ProvidersResponse> =>
    apiClient.patch<ProvidersResponse>(
      API_ENDPOINTS.PROVIDERS.UPDATE_PROVIDER_FLAGS(provider),
      data
    ),
};
