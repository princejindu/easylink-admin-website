import { apiClient } from "./client";
import { API_ENDPOINTS } from "@/constants/api.constants";
import type { ProviderFlags, ProvidersResponse, Provider } from "@/types/config.types";

export const providersApi = {
  getFlags: (): Promise<ProviderFlags> =>
    apiClient.get<ProviderFlags>(API_ENDPOINTS.PROVIDERS.FLAGS),

  updateFlags: (data: Partial<ProviderFlags>): Promise<ProviderFlags> =>
    apiClient.patch<ProviderFlags>(API_ENDPOINTS.PROVIDERS.UPDATE_FLAGS, data),

  getProviders: (): Promise<ProvidersResponse> =>
    apiClient.get<ProvidersResponse>(API_ENDPOINTS.PROVIDERS.LIST),

  updateProviderFlags: (
    provider: "telna" | "transatel",
    data: { catalog?: boolean; purchase?: boolean; statusSync?: boolean }
  ): Promise<ProvidersResponse> =>
    apiClient.patch<ProvidersResponse>(API_ENDPOINTS.PROVIDERS.UPDATE_PROVIDER_FLAGS(provider), data),
};
