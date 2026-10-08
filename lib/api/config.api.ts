import { apiClient } from "./client";
import { API_ENDPOINTS } from "@/constants/api.constants";
import type { SystemConfig, RegionPricingOverride } from "@/types/config.types";

type ApiConfigResponse = {
  global?: { markupPercent?: number; discountPercent?: number };
  regions?: Record<string, { markupPercent?: number; discountPercent?: number }>;
  referralCommissionPercent?: number;
};

async function getFeaturedIds(): Promise<string[]> {
  try {
    const res = await apiClient.get<{ packageIds: string[] }>(
      API_ENDPOINTS.FEATURED_PACKAGES
    );
    return res?.packageIds ?? [];
  } catch {
    return [];
  }
}

export const configApi = {
  get: async (): Promise<SystemConfig> => {
    const [config, featuredPackageIds, referralRate] = await Promise.all([
      apiClient.get<ApiConfigResponse>(API_ENDPOINTS.CONFIG.GET),
      getFeaturedIds(),
      apiClient
        .get<{ commissionPercent: number }>(API_ENDPOINTS.REFERRALS.COMMISSION_RATE)
        .catch(() => ({ commissionPercent: 0 })),
    ]);

    const regionPricingOverrides: RegionPricingOverride[] = Object.entries(
      config?.regions ?? {}
    ).map(([region, value]) => ({
      region,
      markupPercent: Number(value?.markupPercent ?? 0),
    }));

    return {
      globalMarkupPercent: Number(config?.global?.markupPercent ?? 0),
      globalDiscountPercent: Number(config?.global?.discountPercent ?? 0),
      referralCommissionPercent: Number(referralRate?.commissionPercent ?? 0),
      regionPricingOverrides,
      featuredPackageIds,
    };
  },

  update: async (data: Partial<SystemConfig>): Promise<SystemConfig> => {
    const current = await configApi.get();

    await apiClient.put("/admin/esim/pricing/global", {
      markupPercent: data.globalMarkupPercent ?? current.globalMarkupPercent,
      discountPercent: data.globalDiscountPercent ?? current.globalDiscountPercent,
    });

    if (typeof data.referralCommissionPercent === "number") {
      await apiClient.patch("/admin/referrals/commission-rate", {
        commissionPercent: data.referralCommissionPercent,
      });
    }

    const nextOverrides = data.regionPricingOverrides ?? [];
    const currentRegions = new Set(current.regionPricingOverrides.map((r) => r.region));
    const nextRegions = new Set(nextOverrides.map((r) => r.region).filter(Boolean));

    await Promise.all(
      nextOverrides
        .filter((r) => r.region)
        .map((r) =>
          apiClient.put(`/admin/esim/pricing/region/${encodeURIComponent(r.region)}`, {
            markupPercent: r.markupPercent,
            discountPercent: 0,
          })
        )
    );

    await Promise.all(
      Array.from(currentRegions)
        .filter((region) => !nextRegions.has(region))
        .map((region) =>
          apiClient.delete(`/admin/esim/pricing/region/${encodeURIComponent(region)}`)
        )
    );

    if (data.featuredPackageIds) {
      await apiClient.put(API_ENDPOINTS.FEATURED_PACKAGES, {
        packageIds: data.featuredPackageIds,
      });
    }

    return configApi.get();
  },
};
