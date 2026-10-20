"use client";

import { useRouter } from "next/navigation";
import { StatusBadge } from "@/components/shared/status-badge";
import { PaymentMethodBadge, ValidityBadge } from "@/components/purchases/purchase-badges";
import { formatDateTime12, formatMoney } from "@/lib/utils/format.util";
import { ROUTES } from "@/constants/routes.constants";
import type { PurchaseTopup } from "@/types/purchase.types";

const TH = "text-left px-4 py-3 font-medium text-muted-foreground";

export function TopupsCard({ topups }: { topups: PurchaseTopup[] }) {
  const router = useRouter();

  return (
    <div className="bg-card border rounded-lg overflow-hidden">
      <div className="px-4 py-3 border-b bg-muted/50">
        <h3 className="font-medium text-sm">Top ups ({topups.length})</h3>
      </div>
      {!topups.length ? (
        <div className="p-8 text-center text-muted-foreground text-sm">No top ups on this eSIM.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className={TH}>Package</th>
                <th className={TH}>Data</th>
                <th className={`${TH} hidden sm:table-cell`}>Days</th>
                <th className={TH}>Price</th>
                <th className={`${TH} hidden md:table-cell`}>Payment</th>
                <th className={TH}>Status</th>
                <th className={`${TH} hidden lg:table-cell`}>Validity</th>
                <th className={`${TH} hidden xl:table-cell`}>Bought</th>
              </tr>
            </thead>
            <tbody>
              {topups.map((topup) => (
                <tr
                  key={topup.id}
                  tabIndex={0}
                  role="link"
                  onClick={() => router.push(ROUTES.PURCHASE_DETAIL(topup.id))}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") router.push(ROUTES.PURCHASE_DETAIL(topup.id));
                  }}
                  className="border-b last:border-0 hover:bg-accent/50 focus-visible:outline-none focus-visible:bg-accent/50 transition-colors cursor-pointer"
                >
                  <td className="px-4 py-3 font-medium text-primary">{topup.packageName || "Top up"}</td>
                  <td className="px-4 py-3">{topup.dataLabel || "N/A"}</td>
                  <td className="px-4 py-3 hidden sm:table-cell">{topup.durationDays ?? "N/A"}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{formatMoney(topup.price, topup.currency)}</td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <PaymentMethodBadge method={topup.paymentMethod} />
                  </td>
                  <td className="px-4 py-3">
                    {topup.status ? <StatusBadge status={topup.status.toLowerCase()} /> : "N/A"}
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <div className="flex flex-col items-start gap-1">
                      <ValidityBadge state={topup.validity?.state} />
                      {topup.validity?.label && (
                        <span className="text-xs text-muted-foreground">{topup.validity.label}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground whitespace-nowrap hidden xl:table-cell">
                    {formatDateTime12(topup.purchasedAt, "N/A")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
