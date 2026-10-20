"use client";

import { TabShell, TH, TD, UserLink } from "@/components/users/tabs/tab-shell";
import { useUserPage } from "@/components/users/tabs/use-user-page";
import { usersApi } from "@/lib/api/users.api";
import { formatDateTime12, formatMoney } from "@/lib/utils/format.util";

export function ReferredFriendsTab({ userId }: { userId: string }) {
  const { items, total, page, setPage, isLoading, failed } = useUserPage(
    userId,
    usersApi.referrals,
    "Failed to load referred friends"
  );

  return (
    <TabShell
      isLoading={isLoading}
      failed={failed}
      isEmpty={!items.length}
      emptyMessage="This user has not referred anyone yet."
      page={page}
      total={total}
      onPageChange={setPage}
    >
      <thead>
        <tr className="border-b bg-muted/30">
          <th className={TH}>Friend</th>
          <th className={`${TH} text-right`}>Purchases</th>
          <th className={`${TH} text-right`}>Spend</th>
          <th className={`${TH} text-right`}>Commission</th>
          <th className={`${TH} text-right hidden sm:table-cell`}>Pending</th>
          <th className={`${TH} text-right hidden sm:table-cell`}>Available</th>
          <th className={`${TH} hidden lg:table-cell`}>Joined</th>
          <th className={`${TH} hidden lg:table-cell`}>Last purchase</th>
        </tr>
      </thead>
      <tbody>
        {items.map((f, index) => (
          <tr key={f.user?.id ?? index} className="border-b last:border-0">
            <td className={TD}>
              <UserLink user={f.user} />
            </td>
            <td className={`${TD} text-right tabular-nums`}>{f.purchasesCount ?? 0}</td>
            <td className={`${TD} text-right tabular-nums whitespace-nowrap`}>
              {formatMoney(f.totalSpent)}
            </td>
            <td className={`${TD} text-right font-semibold tabular-nums whitespace-nowrap`}>
              {formatMoney(f.commissionEarned)}
            </td>
            <td className={`${TD} text-right tabular-nums whitespace-nowrap text-yellow-700 dark:text-yellow-400 hidden sm:table-cell`}>
              {formatMoney(f.commissionPending)}
            </td>
            <td className={`${TD} text-right tabular-nums whitespace-nowrap text-green-700 dark:text-green-400 hidden sm:table-cell`}>
              {formatMoney(f.commissionAvailable)}
            </td>
            <td className={`${TD} text-muted-foreground whitespace-nowrap hidden lg:table-cell`}>
              {formatDateTime12(f.user?.createdAt, "N/A")}
            </td>
            <td className={`${TD} text-muted-foreground whitespace-nowrap hidden lg:table-cell`}>
              {formatDateTime12(f.lastPurchaseAt, "None yet")}
            </td>
          </tr>
        ))}
      </tbody>
    </TabShell>
  );
}
