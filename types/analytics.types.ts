export interface AnalyticsOverview {
  totalUsers: number;
  purchasesToday: number;
  purchasesThisWeek: number;
  purchasesThisMonth: number;
  revenueToday: number;
  revenueThisWeek: number;
  revenueThisMonth: number;
  topPackages: TopPackage[];
  purchasesByCountry: PurchasesByCountry[];
}

export interface TopPackage {
  packageId: string;
  packageName: string;
  count: number;
  revenue: number;
}

export interface PurchasesByCountry {
  country: string;
  count: number;
  revenue: number;
}
