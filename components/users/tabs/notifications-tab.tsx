"use client";

import { Pill, type BadgeTone } from "@/components/purchases/purchase-badges";
import { TabShell, TH, TD } from "@/components/users/tabs/tab-shell";
import { useUserPage } from "@/components/users/tabs/use-user-page";
import { usersApi } from "@/lib/api/users.api";
import { formatDateTime12, humanize } from "@/lib/utils/format.util";

const TYPE_LABELS: Record<string, string> = {
  ESIM_START_REMINDER: "Start reminder",
  ESIM_PURCHASE: "eSIM purchase",
  ESIM_ACTIVATED: "eSIM activated",
  ESIM_TOPUP: "Top up",
};

const TYPE_TONES: Record<string, BadgeTone> = {
  ESIM_START_REMINDER: "yellow",
  ESIM_PURCHASE: "blue",
  ESIM_ACTIVATED: "green",
  ESIM_TOPUP: "indigo",
  PAYMENT_FAILED: "red",
  REFERRAL_REWARD: "purple",
};

function pushTone(status: string): BadgeTone {
  const value = status.toUpperCase();
  if (["SENT", "DELIVERED", "SUCCESS"].includes(value)) return "green";
  if (["FAILED", "ERROR"].includes(value)) return "red";
  if (["PENDING", "QUEUED"].includes(value)) return "yellow";
  return "gray";
}

export function NotificationsTab({ userId }: { userId: string }) {
  const { items, total, page, setPage, isLoading, failed } = useUserPage(
    userId,
    usersApi.notifications,
    "Failed to load notifications"
  );

  return (
    <TabShell
      isLoading={isLoading}
      failed={failed}
      isEmpty={!items.length}
      emptyMessage="No notifications sent to this user yet."
      page={page}
      total={total}
      onPageChange={setPage}
    >
      <thead>
        <tr className="border-b bg-muted/30">
          <th className={TH}>Type</th>
          <th className={TH}>Message</th>
          <th className={`${TH} hidden md:table-cell`}>Sent</th>
          <th className={TH}>Read</th>
          <th className={`${TH} hidden sm:table-cell`}>Push</th>
        </tr>
      </thead>
      <tbody>
        {items.map((n) => {
          const type = (n.type ?? "").toUpperCase();
          return (
            <tr key={n.id} className="border-b last:border-0">
              <td className={TD}>
                <Pill tone={TYPE_TONES[type] ?? "gray"}>
                  {TYPE_LABELS[type] ?? humanize(n.type)}
                </Pill>
              </td>
              <td className={`${TD} max-w-md`}>
                <div className="font-medium">{n.title || "No title"}</div>
                {n.body && <div className="text-xs text-muted-foreground break-words">{n.body}</div>}
              </td>
              <td className={`${TD} text-muted-foreground whitespace-nowrap hidden md:table-cell`}>
                {formatDateTime12(n.createdAt, "N/A")}
              </td>
              <td className={TD}>
                {n.readAt ? (
                  <span title={formatDateTime12(n.readAt)}>
                    <Pill tone="green">Read</Pill>
                  </span>
                ) : (
                  <Pill tone="gray">Unread</Pill>
                )}
              </td>
              <td className={`${TD} hidden sm:table-cell`}>
                {n.pushStatus ? (
                  <Pill tone={pushTone(n.pushStatus)}>{humanize(n.pushStatus)}</Pill>
                ) : (
                  <span className="text-muted-foreground">N/A</span>
                )}
                {n.pushError && (
                  <div className="mt-1 text-xs text-red-600 dark:text-red-400 break-words max-w-xs">
                    {n.pushError}
                  </div>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </TabShell>
  );
}
