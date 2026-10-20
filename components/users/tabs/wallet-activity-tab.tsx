"use client";

import { useState } from "react";
import { StatusBadge } from "@/components/shared/status-badge";
import {
  BADGE_STATUS,
  TRANSACTION_LABEL,
  toStatusKind,
} from "@/components/referrals/referral-status";
import {
  TabShell,
  TH,
  TD,
  FILTER_CLASS,
  PurchaseLink,
  UserLink,
} from "@/components/users/tabs/tab-shell";
import { DueDate } from "@/components/users/tabs/due-date";
import { useUserPage } from "@/components/users/tabs/use-user-page";
import { usersApi } from "@/lib/api/users.api";
import { formatDateTime12, formatMoney, humanize } from "@/lib/utils/format.util";
import { cn } from "@/lib/utils/cn";

const TYPE_LABELS: Record<string, string> = {
  CREDIT_COMMISSION: "Commission",
  REVERSAL: "Reversal",
  DEBIT_PURCHASE: "Wallet purchase",
  REFUND_PURCHASE: "Wallet refund",
  ADJUSTMENT: "Adjustment",
};

export function WalletActivityTab({ userId }: { userId: string }) {
  const [status, setStatus] = useState("");
  const { items, total, page, setPage, isLoading, failed } = useUserPage(
    userId,
    usersApi.walletTransactions,
    "Failed to load wallet activity",
    { status }
  );

  return (
    <TabShell
      isLoading={isLoading}
      failed={failed}
      isEmpty={!items.length}
      emptyMessage={status ? "No wallet activity with this status." : "No wallet activity yet."}
      page={page}
      total={total}
      onPageChange={setPage}
      toolbar={
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          aria-label="Filter by status"
          className={FILTER_CLASS}
        >
          <option value="">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      }
    >
      <thead>
        <tr className="border-b bg-muted/30">
          <th className={TH}>Type</th>
          <th className={TH}>Status</th>
          <th className={`${TH} text-right`}>Amount</th>
          <th className={TH}>Due</th>
          <th className={`${TH} hidden md:table-cell`}>From friend</th>
          <th className={`${TH} hidden md:table-cell`}>Purchase</th>
          <th className={`${TH} hidden lg:table-cell`}>Created</th>
        </tr>
      </thead>
      <tbody>
        {items.map((tx) => {
          const kind = toStatusKind(tx.status);
          const amount = Number(tx.amount ?? 0);
          return (
            <tr key={tx.id} className="border-b last:border-0">
              <td className={TD}>
                <div className="font-medium">{TYPE_LABELS[(tx.type ?? "").toUpperCase()] ?? humanize(tx.type)}</div>
                {tx.note && <div className="text-xs text-muted-foreground">{tx.note}</div>}
              </td>
              <td className={TD}>
                <StatusBadge
                  status={BADGE_STATUS[kind]}
                  label={kind === "unknown" ? humanize(tx.status) : TRANSACTION_LABEL[kind]}
                />
              </td>
              <td
                className={cn(
                  `${TD} text-right font-semibold tabular-nums whitespace-nowrap`,
                  amount < 0 ? "text-red-600 dark:text-red-400" : "text-green-700 dark:text-green-400",
                  kind === "cancelled" && "line-through opacity-60"
                )}
              >
                {amount > 0 ? "+" : ""}
                {formatMoney(tx.amount, tx.currency)}
              </td>
              <td className={TD}>
                <DueDate
                  status={tx.status}
                  availableAt={tx.availableAt}
                  daysUntilAvailable={tx.daysUntilAvailable}
                  releasedAt={tx.releasedAt}
                />
              </td>
              <td className={`${TD} hidden md:table-cell`}>
                <UserLink user={tx.sourceUser} />
              </td>
              <td className={`${TD} hidden md:table-cell`}>
                <PurchaseLink id={tx.purchase?.id} label={tx.purchase?.packageName} />
              </td>
              <td className={`${TD} text-muted-foreground whitespace-nowrap hidden lg:table-cell`}>
                {formatDateTime12(tx.createdAt, "N/A")}
              </td>
            </tr>
          );
        })}
      </tbody>
    </TabShell>
  );
}
