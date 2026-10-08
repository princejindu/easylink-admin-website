import { apiClient } from "./client";
import { API_ENDPOINTS } from "@/constants/api.constants";
import type {
  Commission,
  CommissionRateResponse,
  CommissionsListParams,
  CommissionsListResponse,
} from "@/types/referrals.types";

export const referralsApi = {
  getCommissionRate: (): Promise<CommissionRateResponse> =>
    apiClient.get<CommissionRateResponse>(
      API_ENDPOINTS.REFERRALS.COMMISSION_RATE
    ),

  updateCommissionRate: (
    commissionPercent: number
  ): Promise<CommissionRateResponse> =>
    apiClient.patch<CommissionRateResponse>(
      API_ENDPOINTS.REFERRALS.COMMISSION_RATE,
      { commissionPercent }
    ),

  listCommissions: async (
    params?: CommissionsListParams
  ): Promise<CommissionsListResponse> => {
    const response = await apiClient.get<{
      items?: Commission[];
      data?: Commission[];
      meta: CommissionsListResponse["meta"];
    }>(API_ENDPOINTS.REFERRALS.COMMISSIONS, params as Record<string, unknown>);

    return {
      data: response?.data ?? response?.items ?? [],
      meta: response?.meta,
    };
  },

  markPaid: (id: string): Promise<{ message: string }> =>
    apiClient.patch<{ message: string }>(
      API_ENDPOINTS.REFERRALS.MARK_PAID(id)
    ),
};
