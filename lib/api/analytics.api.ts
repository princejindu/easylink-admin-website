import { apiClient } from "./client";
import { API_ENDPOINTS } from "@/constants/api.constants";
import type { AnalyticsOverview } from "@/types/analytics.types";

export const analyticsApi = {
  overview: (): Promise<AnalyticsOverview> =>
    apiClient.get<AnalyticsOverview>(API_ENDPOINTS.ANALYTICS.OVERVIEW),
};
