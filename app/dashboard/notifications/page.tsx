"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { ComposeForm } from "@/components/notifications/compose-form";
import { NotificationHistory } from "@/components/notifications/notification-history";
import { notificationsApi } from "@/lib/api/notifications.api";
import { showError } from "@/lib/utils/toast.util";
import { Pagination } from "@/components/shared/pagination";
import type { NotificationHistory as NotifHistory } from "@/types/config.types";

export default function NotificationsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [history, setHistory] = useState<NotifHistory[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  const fetchHistory = async (page = 1) => {
    try {
      const response = await notificationsApi.history({ page, limit: 20 });
      if (!response) return;
      setHistory(response.data);
      setTotal(response.meta.total);
    } catch {
      showError("Failed to load notification history");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory(page);
  }, [page]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notifications"
        description="Compose broadcast notifications and view send history"
      />

      <div className="space-y-6">
        <ComposeForm
          onSent={() => {
            if (page === 1) {
              fetchHistory(1);
            } else {
              setPage(1);
            }
          }}
        />
        <div>
          <NotificationHistory history={history} isLoading={isLoading} />
          <Pagination
            page={page}
            pageSize={20}
            total={total}
            onPageChange={setPage}
          />
        </div>
      </div>
    </div>
  );
}
