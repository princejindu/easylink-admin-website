import { apiClient } from "./client";
import { API_ENDPOINTS } from "@/constants/api.constants";
import type {
  PurchaseDetail,
  PurchasesListResponse,
  PurchasesListParams,
  SyncPurchaseResponse,
  CancelPurchaseResponse,
} from "@/types/purchase.types";

export const purchasesApi = {
  list: (params?: PurchasesListParams): Promise<PurchasesListResponse> =>
    apiClient.get<PurchasesListResponse>(
      API_ENDPOINTS.PURCHASES.LIST,
      params as Record<string, unknown>
    ),

  detail: (id: string): Promise<PurchaseDetail> =>
    apiClient.get<PurchaseDetail>(API_ENDPOINTS.PURCHASES.DETAIL(id)),

  sync: (id: string): Promise<SyncPurchaseResponse> =>
    apiClient.post<SyncPurchaseResponse>(API_ENDPOINTS.PURCHASES.SYNC(id)),

  cancel: (id: string): Promise<CancelPurchaseResponse> =>
    apiClient.post<CancelPurchaseResponse>(API_ENDPOINTS.PURCHASES.CANCEL(id)),
};
