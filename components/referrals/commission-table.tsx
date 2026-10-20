"use client";

import { StatusBadge } from "@/components/shared/status-badge";
import { formatCurrency, formatDate, formatDateTime } from "@/lib/utils/format.util";
import { BADGE_STATUS, COMMISSION_LABEL, toStatusKind } from "@/components/referrals/referral-status";
import type { Commission } from "@/types/referrals.types";

interface CommissionTableProps {
  commissions: Commission[];
}

const HEADER_CLASS = "text-left px-4 py-3 font-medium text-muted-foreground";

export function CommissionTable({ commissions }: CommissionTableProps) {
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
              <th className={HEADER_CLASS}>Referrer</th>
              <th className={`${HEADER_CLASS} hidden md:table-cell`}>Referee</th>
              <th className={`${HEADER_CLASS} hidden sm:table-cell`}>Purchase</th>
              <th className={HEADER_CLASS}>Commission</th>
              <th className={HEADER_CLASS}>Status</th>
              <th className={`${HEADER_CLASS} hidden xl:table-cell`}>Date</th>
            </tr>
          </thead>
          <tbody>
            {commissions.map((commission) => {
              const kind = toStatusKind(commission.status);
              return (
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
                    <StatusBadge
                      status={BADGE_STATUS[kind]}
                      label={kind === "unknown" ? commission.status : COMMISSION_LABEL[kind]}
                    />
                    {kind === "pending" && commission.availableAt && (
                      <div className="mt-1 text-xs text-muted-foreground">
                        Releases {formatDate(commission.availableAt)}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground hidden xl:table-cell">
                    {formatDateTime(commission.createdAt)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
