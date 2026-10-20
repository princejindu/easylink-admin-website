import type { Purchase, PurchaseDetail } from "@/types/purchase.types";

function hasDisputeMetadata(metadata: Record<string, unknown> | null | undefined): boolean {
  return Boolean(metadata && metadata.dispute);
}

/** True when the API flags the order as under a dispute, on the order or in its provider metadata. */
export function isDisputed(purchase: Purchase | PurchaseDetail): boolean {
  if (purchase.disputed === true || Boolean(purchase.dispute)) return true;
  return "providerMetadata" in purchase && hasDisputeMetadata(purchase.providerMetadata);
}
