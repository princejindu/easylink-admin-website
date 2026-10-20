"use client";

import { StatusBadge } from "@/components/shared/status-badge";
import {
  PaymentMethodBadge,
  PurchaseKindBadge,
  ValidityBadge,
} from "@/components/purchases/purchase-badges";
import { TabShell, TH, TD, PurchaseLink } from "@/components/users/tabs/tab-shell";
import { useUserPage } from "@/components/users/tabs/use-user-page";
import { usersApi } from "@/lib/api/users.api";
import { formatDateTime12, formatMoney } from "@/lib/utils/format.util";

export function PurchasesTab({ userId }: { userId: string }) {
  const { items, total, page, setPage, isLoading, failed } = useUserPage(
    userId,
    usersApi.purchases,
    "Failed to load purchases"
  );

  return (
    <TabShell
      isLoading={isLoading}
      failed={failed}
      isEmpty={!items.length}
      emptyMessage="No purchases yet."
      page={page}
      total={total}
      onPageChange={setPage}
    >
      <thead>
        <tr className="border-b bg-muted/30">
          <th className={TH}>Package</th>
          <th className={TH}>Type</th>
          <th className={TH}>Price</th>
          <th className={TH}>Payment</th>
          <th className={TH}>Status</th>
          <th className={`${TH} hidden md:table-cell`}>Validity</th>
          <th className={`${TH} hidden lg:table-cell`}>Bought</th>
        </tr>
      </thead>
      <tbody>
        {items.map((p) => (
          <tr key={p.id} className="border-b last:border-0">
            <td className={TD}>
              <PurchaseLink id={p.id} label={p.packageName || "eSIM"} />
            </td>
            <td className={TD}>
              <div className="flex flex-col items-start gap-1">
                <PurchaseKindBadge isTopup={p.isTopup} />
                {p.isTopup && p.topupOf?.id && (
                  <span className="text-xs">
                    Of <PurchaseLink id={p.topupOf.id} label={p.topupOf.packageName || "parent eSIM"} />
                  </span>
                )}
              </div>
            </td>
            <td className={`${TD} whitespace-nowrap`}>{formatMoney(p.price, p.currency)}</td>
            <td className={TD}>
              <PaymentMethodBadge method={p.paymentMethod} />
            </td>
            <td className={TD}>
              {p.status ? <StatusBadge status={p.status.toLowerCase()} /> : "N/A"}
            </td>
            <td className={`${TD} hidden md:table-cell`}>
              <ValidityBadge state={p.validityState} />
            </td>
            <td className={`${TD} text-muted-foreground whitespace-nowrap hidden lg:table-cell`}>
              {formatDateTime12(p.purchasedAt, "N/A")}
            </td>
          </tr>
        ))}
      </tbody>
    </TabShell>
  );
}
