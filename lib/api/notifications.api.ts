import { apiClient } from "./client";
import { API_ENDPOINTS } from "@/constants/api.constants";
import type {
  NotificationHistory,
  BroadcastNotificationRequest,
} from "@/types/config.types";

export const notificationsApi = {
  broadcast: (
    data: BroadcastNotificationRequest
  ): Promise<{ message: string }> =>
    apiClient.post<{ message: string }>(
      API_ENDPOINTS.NOTIFICATIONS.BROADCAST,
      data
    ),

  history: (params?: {
    page?: number;
    limit?: number;
  }): Promise<{ notifications: NotificationHistory[]; total: number }> =>
    apiClient.get<{ notifications: NotificationHistory[]; total: number }>(
      API_ENDPOINTS.NOTIFICATIONS.HISTORY,
      params as Record<string, unknown>
    ),
};
