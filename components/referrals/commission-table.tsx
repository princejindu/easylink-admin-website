"use client";

import { useState } from "react";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatCurrency, formatDateTime } from "@/lib/utils/format.util";
import { referralsApi } from "@/lib/api/referrals.api";
import { showSuccess, showError } from "@/lib/utils/toast.util";
import { getErrorMessage } from "@/lib/utils/error.util";
import type { Commission } from "@/types/referrals.types";

interface CommissionTableProps {
  commissions: Commission[];
  onRefresh: () => void;
}

export function CommissionTable({
  commissions,
  onRefresh,
}: CommissionTableProps) {
  const [payingId, setPayingId] = useState<string | null>(null);

  const handleMarkPaid = async (commission: Commission) => {
    const confirmed = window.confirm(
      `Mark this commission as paid?\n\nReferrer: ${commission.referrerName}\nCommission: ${formatCurrency(commission.commissionAmount)}\n\nThis cannot be undone.`
    );
    if (!confirmed) return;

    setPayingId(commission.id);
    try {
      const response = await referralsApi.markPaid(commission.id);
      if (!response) return;
      showSuccess("Commission marked as paid");
      onRefresh();
    } catch (error) {
      showError(getErrorMessage(error, "Failed to mark commission as paid"));
    } finally {
      setPayingId(null);
    }
  };

  if (!commissions.length) {
    return (
      <div className="bg-card border rounded-lg p-12 text-center text-muted-foreground">
        No commissions found.
      </div>
    );
  }

  return (
    <div className="bg-card border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                Referrer
              </th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">
                Referee
              </th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden sm:table-cell">
                Purchase
              </th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                Commission
              </th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                Status
              </th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden xl:table-cell">
                Date
              </th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {commissions.map((commission) => (
              <tr
                key={commission.id}
                className="border-b last:border-0 hover:bg-accent/50 transition-colors"
              >
                <td className="px-4 py-3">
                  <div className="font-medium">{commission.referrerName}</div>
                  <div className="text-xs text-muted-foreground">
                    {commission.referrerEmail}
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                  {commission.refereeEmail}
                </td>
                <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">
                  {formatCurrency(commission.purchaseAmount)}
                </td>
                <td className="px-4 py-3 font-medium">
                  {formatCurrency(commission.commissionAmount)}
                  <span className="ml-1 text-xs text-muted-foreground">
                    ({commission.commissionPercent}%)
                  </span>
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={commission.status} />
                </td>
                <td className="px-4 py-3 text-muted-foreground hidden xl:table-cell">
                  {formatDateTime(commission.createdAt)}
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleMarkPaid(commission)}
                    disabled={
                      commission.status === "paid" || payingId === commission.id
                    }
                    className="text-xs font-medium text-primary hover:text-primary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {payingId === commission.id
                      ? "Saving..."
                      : commission.status === "paid"
                        ? "Paid"
                        : "Mark as Paid"}
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
