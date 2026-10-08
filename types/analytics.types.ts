export interface AnalyticsOverview {
  users: {
    total: number;
    newToday: number;
    newThisWeek: number;
    newThisMonth: number;
  };
  purchases: {
    today: number;
    thisWeek: number;
    thisMonth: number;
  };
  revenue: {
    today: number;
    thisWeek: number;
    thisMonth: number;
    currency: string;
  };
}

export interface TopPackage {
  packageId: string;
  packageName: string;
  purchaseCount: number;
  revenue: number;
}

export interface TopPackagesResponse {
  packages: TopPackage[];
}

export interface PurchaseByCountry {
  countryCode: string;
  countryName: string;
  purchaseCount: number;
}

// Alias kept for backward compatibility
export type PurchasesByCountry = PurchaseByCountry;

export interface PurchasesByCountryResponse {
  countries: PurchaseByCountry[];
}

export interface LegacyAnalyticsOverview {
  totalUsers: number;
  purchasesToday: number;
  purchasesThisWeek: number;
  purchasesThisMonth: number;
  revenueToday: number;
  revenueThisWeek: number;
  revenueThisMonth: number;
  topPackages: Array<{
    packageId: string;
    packageName: string;
    count: number;
    revenue: number;
  }>;
  purchasesByCountry: Array<{
    country: string;
    count: number;
    revenue: number;
  }>;
}
