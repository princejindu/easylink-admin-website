import { apiClient } from "./client";
import { API_ENDPOINTS } from "@/constants/api.constants";
import type {
  AnalyticsOverview,
  PurchasesByCountry,
  TopPackage,
} from "@/types/analytics.types";

export const analyticsApi = {
  overview: async (): Promise<AnalyticsOverview> => {
    return apiClient.get<AnalyticsOverview>(API_ENDPOINTS.ANALYTICS.OVERVIEW);
  },

  topPackages: async (limit = 10): Promise<{ packages: TopPackage[] }> => {
    return apiClient.get<{ packages: TopPackage[] }>(
      API_ENDPOINTS.ANALYTICS.TOP_PACKAGES,
      { limit } as Record<string, unknown>
    );
  },

  purchasesByCountry: async (): Promise<{ countries: PurchasesByCountry[] }> => {
    return apiClient.get<{ countries: PurchasesByCountry[] }>(
      API_ENDPOINTS.ANALYTICS.PURCHASES_BY_COUNTRY
    );
  },
};
