"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { ComposeForm } from "@/components/notifications/compose-form";
import { NotificationHistory } from "@/components/notifications/notification-history";
import { notificationsApi } from "@/lib/api/notifications.api";
import { showError } from "@/lib/utils/toast.util";
import type { NotificationHistory as NotifHistory } from "@/types/config.types";

export default function NotificationsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [history, setHistory] = useState<NotifHistory[]>([]);

  const fetchHistory = async () => {
    try {
      const response = await notificationsApi.history({ page: 1, limit: 20 });
      setHistory(response.notifications);
    } catch {
      showError("Failed to load notification history");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notifications"
        description="Compose broadcast notifications and view send history"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ComposeForm onSent={fetchHistory} />
        <NotificationHistory history={history} isLoading={isLoading} />
      </div>
    </div>
  );
}
