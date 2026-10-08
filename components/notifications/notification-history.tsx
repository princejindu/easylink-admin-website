"use client";

import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { formatDateTime } from "@/lib/utils/format.util";
import type { NotificationHistory as NotifHistory } from "@/types/config.types";

interface NotificationHistoryProps {
  history: NotifHistory[];
  isLoading: boolean;
}

const TARGET_LABELS: Record<string, string> = {
  all: "All users",
  country: "Country",
  purchase_status: "Purchase status",
};

export function NotificationHistory({
  history,
  isLoading,
}: NotificationHistoryProps) {
  return (
    <div className="bg-card border rounded-lg p-6">
      <h2 className="text-lg font-semibold mb-4">Send History</h2>

      {isLoading ? (
        <div className="flex items-center justify-center py-10">
          <LoadingSpinner />
        </div>
      ) : !history.length ? (
        <p className="text-sm text-muted-foreground text-center py-10">
          No notifications sent yet.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left px-3 py-2 font-medium text-muted-foreground">
                  Date sent
                </th>
                <th className="text-left px-3 py-2 font-medium text-muted-foreground">
                  Title
                </th>
                <th className="text-left px-3 py-2 font-medium text-muted-foreground">
                  Target
                </th>
                <th className="text-left px-3 py-2 font-medium text-muted-foreground">
                  Recipients
                </th>
                <th className="text-left px-3 py-2 font-medium text-muted-foreground">
                  Sent by
                </th>
              </tr>
            </thead>
            <tbody>
              {history.map((notif) => (
                <tr
                  key={notif.id}
                  className="border-b last:border-0 hover:bg-accent/50 transition-colors"
                >
                  <td className="px-3 py-2 text-muted-foreground whitespace-nowrap">
                    {formatDateTime(notif.sentAt)}
                  </td>
                  <td className="px-3 py-2 font-medium">
                    <div>{notif.title}</div>
                    <div className="text-xs text-muted-foreground line-clamp-1">
                      {notif.body}
                    </div>
                  </td>
                  <td className="px-3 py-2 text-muted-foreground">
                    {TARGET_LABELS[notif.target] ?? notif.target}
                    {notif.target !== "all" &&
                      notif.filters &&
                      Object.keys(notif.filters).length > 0 && (
                        <span className="text-xs">
                          {" "}
                          ({Object.values(notif.filters).join(", ")})
                        </span>
                      )}
                  </td>
                  <td className="px-3 py-2 text-muted-foreground">
                    {notif.recipientCount}
                  </td>
                  <td className="px-3 py-2 text-muted-foreground">
                    {notif.sentBy ?? "—"}
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
