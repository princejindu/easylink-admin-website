"use client";

import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { formatDateTime } from "@/lib/utils/format.util";
import type { NotificationHistory as NotifHistory } from "@/types/config.types";

interface NotificationHistoryProps {
  history: NotifHistory[];
  isLoading: boolean;
}

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
        <div className="space-y-3">
          {history.map((notif) => (
            <div key={notif.id} className="p-4 border rounded-lg space-y-1">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-medium">{notif.title}</p>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {formatDateTime(notif.sentAt)}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{notif.body}</p>
              <p className="text-xs text-muted-foreground">
                Sent to {notif.recipientCount} users
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
