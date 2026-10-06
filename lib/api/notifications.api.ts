import { apiClient } from "./client";
import { API_ENDPOINTS } from "@/constants/api.constants";
import type {
  BroadcastNotificationRequest,
  BroadcastNotificationResponse,
  NotificationHistoryResponse,
} from "@/types/config.types";

export const notificationsApi = {
  broadcast: (
    data: BroadcastNotificationRequest
  ): Promise<BroadcastNotificationResponse> =>
    apiClient.post<BroadcastNotificationResponse>(
      API_ENDPOINTS.NOTIFICATIONS.BROADCAST,
      data
    ),

  history: (params?: {
    page?: number;
    limit?: number;
  }): Promise<NotificationHistoryResponse> =>
    apiClient.get<NotificationHistoryResponse>(
      API_ENDPOINTS.NOTIFICATIONS.HISTORY,
      params as Record<string, unknown>
    ),
};
