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

export type BroadcastTarget = "all" | "country" | "purchase_status";

export type PurchaseStatus = "active" | "completed" | "pending" | "failed";

export interface NotificationHistory {
  id: string;
  title: string;
  body: string;
  target: BroadcastTarget;
  filters: Record<string, unknown>;
  sentAt: string;
  recipientCount: number;
  sentBy: string | null;
}

export interface BroadcastNotificationRequest {
  title: string;
  body: string;
  target: BroadcastTarget;
  filters: Record<string, unknown>;
}

export interface BroadcastNotificationResponse {
  notificationId: string;
  sentAt: string;
  recipientCount: number;
  title: string;
  body: string;
  target: BroadcastTarget;
  filters: Record<string, unknown>;
}

export interface NotificationHistoryMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface NotificationHistoryResponse {
  data: NotificationHistory[];
  meta: NotificationHistoryMeta;
}
