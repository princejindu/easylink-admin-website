import { apiClient } from "./client";
import { API_ENDPOINTS } from "@/constants/api.constants";
import type {
  AnalyticsOverview,
  TopPackagesResponse,
  PurchasesByCountryResponse,
} from "@/types/analytics.types";

export const analyticsApi = {
  overview: (): Promise<AnalyticsOverview> =>
    apiClient.get<AnalyticsOverview>(API_ENDPOINTS.ANALYTICS.OVERVIEW),

  topPackages: (limit = 10): Promise<TopPackagesResponse> =>
    apiClient.get<TopPackagesResponse>(`${API_ENDPOINTS.ANALYTICS.TOP_PACKAGES}?limit=${limit}`),

  purchasesByCountry: (): Promise<PurchasesByCountryResponse> =>
    apiClient.get<PurchasesByCountryResponse>(API_ENDPOINTS.ANALYTICS.PURCHASES_BY_COUNTRY),
};
