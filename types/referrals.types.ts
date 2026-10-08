export interface Commission {
  id: string;
  referrerId: string;
  referrerEmail: string;
  referrerName: string;
  refereeId: string;
  refereeEmail: string;
  purchaseAmount: number;
  commissionAmount: number;
  commissionPercent: number;
  status: "pending" | "paid";
  createdAt: string;
  paidAt: string | null;
}

export interface CommissionsMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CommissionsListResponse {
  data: Commission[];
  meta: CommissionsMeta;
}

export interface CommissionsListParams {
  page?: number;
  limit?: number;
}

export interface CommissionRateResponse {
  commissionPercent: number;
}
