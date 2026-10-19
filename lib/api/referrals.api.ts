import { apiClient } from "./client";
import { API_ENDPOINTS } from "@/constants/api.constants";
import type {
  Commission,
  CommissionRateResponse,
  CommissionsListParams,
  CommissionsListResponse,
  PageParams,
  PaginatedList,
  ReferralWallet,
  WalletTransaction,
} from "@/types/referrals.types";

type RawList<T> = {
  items?: T[];
  data?: T[];
  meta?: PaginatedList<T>["meta"];
} | null;

const toPaginatedList = <T>(response: RawList<T>): PaginatedList<T> => ({
  data: response?.data ?? response?.items ?? [],
  meta: response?.meta,
});

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

  listWallets: async (
    params?: PageParams
  ): Promise<PaginatedList<ReferralWallet>> =>
    toPaginatedList(
      await apiClient.get<RawList<ReferralWallet>>(
        API_ENDPOINTS.REFERRALS.WALLETS,
        params as Record<string, unknown>
      )
    ),

  listWalletTransactions: async (
    userId: string,
    params?: PageParams
  ): Promise<PaginatedList<WalletTransaction>> =>
    toPaginatedList(
      await apiClient.get<RawList<WalletTransaction>>(
        API_ENDPOINTS.REFERRALS.WALLET_TRANSACTIONS(userId),
        params as Record<string, unknown>
      )
    ),
};
