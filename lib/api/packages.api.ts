import { apiClient } from "./client";
import { API_ENDPOINTS } from "@/constants/api.constants";
import type { EsimPackage, PackagesListResponse } from "@/types/package.types";

export const packagesApi = {
  list: (params?: {
    page?: number;
    limit?: number;
  }): Promise<PackagesListResponse> =>
    apiClient.get<PackagesListResponse>(
      API_ENDPOINTS.PACKAGES.LIST,
      params as Record<string, unknown>
    ),

  feature: (id: string): Promise<EsimPackage> =>
    apiClient.patch<EsimPackage>(API_ENDPOINTS.PACKAGES.FEATURE(id)),

  unfeature: (id: string): Promise<EsimPackage> =>
    apiClient.patch<EsimPackage>(API_ENDPOINTS.PACKAGES.UNFEATURE(id)),
};
