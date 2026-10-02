import { apiClient } from "./client";
import { API_ENDPOINTS } from "@/constants/api.constants";
import type {
  Order,
  OrdersListResponse,
  OrdersListParams,
} from "@/types/order.types";

export const ordersApi = {
  list: (params?: OrdersListParams): Promise<OrdersListResponse> =>
    apiClient.get<OrdersListResponse>(
      API_ENDPOINTS.ORDERS.LIST,
      params as Record<string, unknown>
    ),

  detail: (id: string): Promise<Order> =>
    apiClient.get<Order>(API_ENDPOINTS.ORDERS.DETAIL(id)),

  resync: (id: string): Promise<Order> =>
    apiClient.post<Order>(API_ENDPOINTS.ORDERS.RESYNC(id)),

  cancel: (id: string): Promise<void> =>
    apiClient.delete<void>(API_ENDPOINTS.ORDERS.CANCEL(id)),
};
