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

export interface PurchasesByCountry {
  countryCode: string;
  countryName: string;
  purchaseCount: number;
}
