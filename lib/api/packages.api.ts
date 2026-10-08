import { apiClient } from "./client";
import { API_ENDPOINTS } from "@/constants/api.constants";
import type { EsimPackage, PackagesListResponse } from "@/types/package.types";

type ApiPackage = {
  id: string;
  name: string;
  price?: number;
  dataGB?: number;
  durationDays?: number;
  supportedCountries?: string[];
  countryAlpha3?: string;
  countryRegion?: string;
  isFeatured?: boolean;
  provider?: string;
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

async function setFeaturedIds(packageIds: string[]): Promise<void> {
  await apiClient.put<void>(API_ENDPOINTS.FEATURED_PACKAGES, { packageIds });
}

export const packagesApi = {
  list: async (params?: {
    page?: number;
    limit?: number;
  }): Promise<PackagesListResponse> => {
    try {
      const [response, featuredIds] = await Promise.all([
        apiClient.get<{
          items: ApiPackage[];
          meta: { total: number; page: number; limit: number };
        }>(API_ENDPOINTS.PACKAGES.LIST, params as Record<string, unknown>),
        getFeaturedIds(),
      ]);

      const packages = Array.isArray(response?.items)
        ? response.items.map((p) => ({
            id: p.id,
            name: p.name,
            dataGb: Number(p.dataGB ?? 0),
            validityDays: Number(p.durationDays ?? 0),
            priceGbp: Number(p.price ?? 0),
            countries: p.supportedCountries ?? (p.countryAlpha3 ? [p.countryAlpha3] : []),
            provider: p.provider as EsimPackage["provider"],
            isFeatured: featuredIds.includes(p.id) || Boolean(p.isFeatured),
          }))
        : [];

      return {
        packages,
        total: response?.meta?.total ?? packages.length,
        page: response?.meta?.page ?? params?.page ?? 1,
        limit: response?.meta?.limit ?? params?.limit ?? 20,
      };
    } catch {
      // Local/dev setup may not have a valid Telna/Transatel API key.
      // Show an empty packages table instead of crashing the page.
      return {
        packages: [],
        total: 0,
        page: params?.page ?? 1,
        limit: params?.limit ?? 20,
      };
    }
  },

  feature: async (id: string): Promise<EsimPackage> => {
    const ids = await getFeaturedIds();
    await setFeaturedIds(Array.from(new Set([...ids, id])));
    return { id } as EsimPackage;
  },

  unfeature: async (id: string): Promise<EsimPackage> => {
    const ids = await getFeaturedIds();
    await setFeaturedIds(ids.filter((item) => item !== id));
    return { id } as EsimPackage;
  },
};
