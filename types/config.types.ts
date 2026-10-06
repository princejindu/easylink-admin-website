export interface PricingOverride {
  markupPercent: number;
  discountPercent: number;
}

export interface EsimPricingConfig {
  global: PricingOverride;
  regions: Record<string, PricingOverride>;
  packages: Record<string, PricingOverride>;
  countries?: Record<string, PricingOverride>;
}

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

export interface FeaturedPackages {
  packageIds: string[];
}

export interface PopularPackages {
  packageIds: string[];
}

export interface Provider {
  name: string;
  displayName: string;
  flags: {
    catalog: boolean;
    purchase: boolean;
    statusSync: boolean;
  };
}

export interface ProvidersResponse {
  providers: Provider[];
}

export interface ProviderFlags {
  activeProvider?: "transatel" | "telna";
  flags?: Record<string, boolean>;
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
