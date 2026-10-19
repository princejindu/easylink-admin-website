"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";
import { StatusBadge } from "@/components/shared/status-badge";
import { DisputedBadge } from "@/components/purchases/disputed-badge";
import { isDisputed } from "@/lib/utils/dispute.util";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { formatDateTime, formatCurrency } from "@/lib/utils/format.util";
import { purchasesApi } from "@/lib/api/purchases.api";
import { showSuccess, showError } from "@/lib/utils/toast.util";
import { ROUTES } from "@/constants/routes.constants";
import type { Purchase } from "@/types/purchase.types";

interface PurchaseTableProps {
  purchases: Purchase[];
  onRefresh: () => void;
}

export function PurchaseTable({ purchases, onRefresh }: PurchaseTableProps) {
  const router = useRouter();
  const [syncingId, setSyncingId] = useState<string | null>(null);

  const handleSync = async (e: React.MouseEvent, purchaseId: string) => {
    e.stopPropagation();
    if (syncingId) return;
    setSyncingId(purchaseId);
    try {
      const result = await purchasesApi.sync(purchaseId);
      showSuccess(result.message ?? "Status synced.");
      onRefresh();
    } catch (err: unknown) {
      const apiErr = err as { statusCode?: number; message?: string };
      if (apiErr?.statusCode === 502) {
        showError("Provider unavailable, try again shortly.");
      } else {
        showError(apiErr?.message ?? "Sync failed.");
      }
    } finally {
      setSyncingId(null);
    }
  };

  if (!purchases.length) {
    return (
      <div className="bg-card border rounded-lg p-12 text-center text-muted-foreground">
        No purchases found.
      </div>
    );
  }

  return (
    <div className="bg-card border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden xl:table-cell">
                Date
              </th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                User
              </th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden sm:table-cell">
                Package
              </th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                Amount
              </th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                Status
              </th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">
                Provider
              </th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                Sync
              </th>
            </tr>
          </thead>
          <tbody>
            {purchases.map((purchase) => (
              <tr
                key={purchase.id}
                onClick={() =>
                  router.push(ROUTES.PURCHASE_DETAIL(purchase.id))
                }
                className="border-b last:border-0 hover:bg-accent/50 transition-colors cursor-pointer"
              >
                <td className="px-4 py-3 text-muted-foreground hidden xl:table-cell whitespace-nowrap">
                  {formatDateTime(purchase.createdAt)}
                </td>
                <td className="px-4 py-3">
                  <div className="font-medium leading-tight">{purchase.userName}</div>
                  <div className="text-xs text-muted-foreground">{purchase.userEmail}</div>
                </td>
                <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">
                  {purchase.packageName}
                </td>
                <td className="px-4 py-3 font-medium whitespace-nowrap">
                  {formatCurrency(purchase.amount, purchase.currency)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap items-center gap-1">
                    <StatusBadge status={purchase.status} />
                    {isDisputed(purchase) && <DisputedBadge />}
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground capitalize hidden md:table-cell">
                  {purchase.provider}
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={(e) => handleSync(e, purchase.id)}
                    disabled={syncingId === purchase.id}
                    title="Sync status from provider"
                    className="p-1.5 rounded-md hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {syncingId === purchase.id ? (
                      <LoadingSpinner size="sm" />
                    ) : (
                      <RefreshCw className="w-4 h-4 text-muted-foreground" />
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
