import { apiClient } from "./client";
import type {
  EsimPricingConfig,
  FeaturedPackages,
  PopularPackages,
} from "@/types/config.types";

const BASE = "/admin/esim";

export const esimConfigApi = {
  getPricing: (): Promise<EsimPricingConfig> =>
    apiClient.get<EsimPricingConfig>(`${BASE}/pricing`),

  updateGlobalPricing: (data: {
    markupPercent: number;
    discountPercent: number;
  }): Promise<EsimPricingConfig> =>
    apiClient.put<EsimPricingConfig>(`${BASE}/pricing/global`, data),

  setRegionPricing: (
    region: string,
    data: { markupPercent: number; discountPercent: number }
  ): Promise<EsimPricingConfig> =>
    apiClient.put<EsimPricingConfig>(`${BASE}/pricing/region/${encodeURIComponent(region)}`, data),

  deleteRegionPricing: (region: string): Promise<EsimPricingConfig> =>
    apiClient.delete<EsimPricingConfig>(`${BASE}/pricing/region/${encodeURIComponent(region)}`),

  setPackagePricing: (
    id: string,
    data: { markupPercent: number; discountPercent: number }
  ): Promise<EsimPricingConfig> =>
    apiClient.put<EsimPricingConfig>(`${BASE}/pricing/package/${id}`, data),

  deletePackagePricing: (id: string): Promise<EsimPricingConfig> =>
    apiClient.delete<EsimPricingConfig>(`${BASE}/pricing/package/${id}`),

  getFeaturedPackages: (): Promise<FeaturedPackages> =>
    apiClient.get<FeaturedPackages>(`${BASE}/featured-packages`),

  setFeaturedPackages: (packageIds: string[]): Promise<FeaturedPackages> =>
    apiClient.put<FeaturedPackages>(`${BASE}/featured-packages`, { packageIds }),

  getPopularPackages: (): Promise<PopularPackages> =>
    apiClient.get<PopularPackages>(`${BASE}/popular`),

  setPopularPackages: (packageIds: string[]): Promise<PopularPackages> =>
    apiClient.put<PopularPackages>(`${BASE}/popular`, { packageIds }),

  clearCache: (): Promise<{ message: string }> =>
    apiClient.delete<{ message: string }>(`${BASE}/cache`),
};
