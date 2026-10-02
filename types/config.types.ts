export interface SystemConfig {
  globalMarkupPercent: number;
  globalDiscountPercent: number;
  referralCommissionPercent: number;
  regionPricingOverrides: RegionPricingOverride[];
  featuredPackageIds: string[];
}

export interface RegionPricingOverride {
  region: string;
  markupPercent: number;
}

export interface ProviderFlags {
  activeProvider: "transatel" | "telna";
  flags: Record<string, boolean>;
}

export interface NotificationHistory {
  id: string;
  title: string;
  body: string;
  sentAt: string;
  recipientCount: number;
}

export interface BroadcastNotificationRequest {
  title: string;
  body: string;
}
