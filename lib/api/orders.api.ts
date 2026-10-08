import { apiClient } from "./client";
import { API_ENDPOINTS } from "@/constants/api.constants";
import type {
  Order,
  OrdersListResponse,
  OrdersListParams,
} from "@/types/order.types";

type ApiPurchase = {
  id: string;
  userId: string;
  userEmail?: string | null;
  userName?: string | null;
  packageId?: string;
  packageName?: string;
  provider?: string;
  status?: string;
  amount?: number;
  amountGbp?: number;
  currency?: string;
  createdAt?: string;
  updatedAt?: string;
};

function normalizePurchase(p: ApiPurchase): Order {
  const nameParts = (p.userName ?? "").split(" ").filter(Boolean);
  const createdAt = p.createdAt ?? new Date().toISOString();

  return {
    id: p.id,
    userId: p.userId,
    user:
      p.userEmail || p.userName
        ? {
            firstName: nameParts[0] ?? "",
            lastName: nameParts.slice(1).join(" "),
            email: p.userEmail ?? "",
          }
        : undefined,
    packageId: p.packageId ?? "",
    packageName: p.packageName,
    provider: (p.provider ?? "telna") as Order["provider"],
    status: (p.status ?? "pending") as Order["status"],
    amountGbp: Number(p.amountGbp ?? p.amount ?? 0),
    createdAt,
    updatedAt: p.updatedAt ?? createdAt,
  };
}

export const ordersApi = {
  list: async (params?: OrdersListParams): Promise<OrdersListResponse> => {
    const apiParams: Record<string, unknown> = {
      page: params?.page,
      limit: params?.limit,
      status: params?.status || undefined,
      provider: params?.provider || undefined,
      userId: params?.userId || undefined,
      startDate: params?.dateFrom || undefined,
      endDate: params?.dateTo || undefined,
    };

    const response = await apiClient.get<{
      data: ApiPurchase[];
      meta: { total: number; page: number; limit: number; totalPages?: number };
    }>(API_ENDPOINTS.ORDERS.LIST, apiParams);

    const orders = Array.isArray(response?.data)
      ? response.data.map(normalizePurchase)
      : [];

    return {
      orders,
      total: response?.meta?.total ?? orders.length,
      page: response?.meta?.page ?? params?.page ?? 1,
      limit: response?.meta?.limit ?? 20,
    };
  },

  detail: async (id: string): Promise<Order> => {
    const response = await apiClient.get<ApiPurchase>(
      API_ENDPOINTS.ORDERS.DETAIL(id)
    );
    return normalizePurchase(response);
  },

  resync: async (id: string): Promise<Order> => {
    const response = await apiClient.post<ApiPurchase>(
      API_ENDPOINTS.ORDERS.RESYNC(id)
    );
    return normalizePurchase(response);
  },

  cancel: (id: string): Promise<Record<string, unknown>> =>
    apiClient.post<Record<string, unknown>>(API_ENDPOINTS.ORDERS.CANCEL(id)),
};
