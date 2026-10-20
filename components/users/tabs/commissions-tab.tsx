"use client";

import { StatusBadge } from "@/components/shared/status-badge";
import { PaymentMethodBadge } from "@/components/purchases/purchase-badges";
import {
  BADGE_STATUS,
  COMMISSION_LABEL,
  toStatusKind,
} from "@/components/referrals/referral-status";
import { TabShell, TH, TD, PurchaseLink, UserLink } from "@/components/users/tabs/tab-shell";
import { DueDate } from "@/components/users/tabs/due-date";
import { useUserPage } from "@/components/users/tabs/use-user-page";
import { usersApi } from "@/lib/api/users.api";
import { formatDateTime12, formatMoney, humanize } from "@/lib/utils/format.util";

function formatRate(rate?: number | null): string {
  if (rate === null || rate === undefined) return "N/A";
  return `${Number(rate)}%`;
}

export function CommissionsTab({ userId }: { userId: string }) {
  const { items, total, page, setPage, isLoading, failed } = useUserPage(
    userId,
    usersApi.commissions,
    "Failed to load commissions"
  );

  return (
    <TabShell
      isLoading={isLoading}
      failed={failed}
      isEmpty={!items.length}
      emptyMessage="No commissions earned yet."
      page={page}
      total={total}
      onPageChange={setPage}
    >
      <thead>
        <tr className="border-b bg-muted/30">
          <th className={TH}>Friend</th>
          <th className={TH}>Their purchase</th>
          <th className={`${TH} hidden md:table-cell`}>Paid by</th>
          <th className={`${TH} text-right`}>Amount</th>
          <th className={`${TH} text-right hidden sm:table-cell`}>Rate</th>
          <th className={TH}>Status</th>
          <th className={TH}>Due</th>
        </tr>
      </thead>
      <tbody>
        {items.map((c) => {
          const kind = toStatusKind(c.status);
          return (
            <tr key={c.id} className="border-b last:border-0">
              <td className={TD}>
                <UserLink user={c.sourceUser} />
              </td>
              <td className={TD}>
                <PurchaseLink id={c.purchase?.id} label={c.purchase?.packageName} />
                {c.purchase && (
                  <div className="text-xs text-muted-foreground">
                    {formatMoney(c.purchase.price, c.currency)}
                    {c.purchase.isTopup ? ", top up" : ""}
                  </div>
                )}
              </td>
              <td className={`${TD} hidden md:table-cell`}>
                <PaymentMethodBadge method={c.purchase?.paymentMethod} />
              </td>
              <td className={`${TD} text-right font-semibold tabular-nums whitespace-nowrap`}>
                {formatMoney(c.amount, c.currency)}
                {typeof c.reversedAmount === "number" && c.reversedAmount !== 0 && (
                  <div className="text-xs font-normal text-red-600 dark:text-red-400">
                    Reversed {formatMoney(Math.abs(c.reversedAmount), c.currency)}
                    {c.reversedAt ? ` on ${formatDateTime12(c.reversedAt)}` : ""}
                  </div>
                )}
              </td>
              <td className={`${TD} text-right tabular-nums hidden sm:table-cell`}>
                {formatRate(c.rate)}
              </td>
              <td className={TD}>
                <StatusBadge
                  status={BADGE_STATUS[kind]}
                  label={kind === "unknown" ? humanize(c.status) : COMMISSION_LABEL[kind]}
                />
              </td>
              <td className={TD}>
                <DueDate
                  status={c.status}
                  availableAt={c.availableAt}
                  daysUntilAvailable={c.daysUntilAvailable}
                  releasedAt={c.paidAt}
                />
              </td>
            </tr>
          );
        })}
      </tbody>
    </TabShell>
  );
}
