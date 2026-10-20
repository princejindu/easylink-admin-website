export type ReferralStatusKind = "pending" | "available" | "cancelled" | "unknown";

const AVAILABLE_VALUES = ["available", "paid", "completed", "released"];
const CANCELLED_VALUES = ["cancelled", "canceled", "reversed"];

/** Maps API status values (any case, including legacy PAID and REVERSED) to one of three states. */
export function toStatusKind(status: string | null | undefined): ReferralStatusKind {
  const value = (status ?? "").toLowerCase();
  if (value === "pending") return "pending";
  if (AVAILABLE_VALUES.includes(value)) return "available";
  if (CANCELLED_VALUES.includes(value)) return "cancelled";
  return "unknown";
}

/** StatusBadge colour key for each state. */
export const BADGE_STATUS: Record<ReferralStatusKind, string> = {
  pending: "pending",
  available: "paid",
  cancelled: "cancelled",
  unknown: "unknown",
};

export const COMMISSION_LABEL: Record<ReferralStatusKind, string> = {
  pending: "Pending",
  available: "Available",
  cancelled: "Cancelled",
  unknown: "Unknown",
};

export const TRANSACTION_LABEL: Record<ReferralStatusKind, string> = {
  pending: "Pending",
  available: "Completed",
  cancelled: "Cancelled",
  unknown: "Unknown",
};
