export interface Purchase {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  packageName: string;
  packageId: string;
  amount: number;
  currency: string;
  status: string;
  provider: string;
  providerOrderId: string;
  createdAt: string;
  updatedAt: string;
}

export interface PurchaseDetail extends Purchase {
  stripePaymentIntentId?: string;
  stripeChargeId?: string;
  iccid?: string;
  activationCode?: string;
  qrCodeData?: string;
  apn?: string;
  providerMetadata?: Record<string, unknown>;
  canCancel: boolean;
}

export interface PurchasesListResponse {
  data: Purchase[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface PurchasesListParams {
  page?: number;
  limit?: number;
  status?: string;
  userId?: string;
  provider?: string;
  startDate?: string;
  endDate?: string;
}

export interface SyncPurchaseResponse {
  id: string;
  status: string;
  updatedAt: string;
  message: string;
}

export interface CancelPurchaseResponse {
  id: string;
  status: string;
  refundId: string;
  refundAmount: number;
  currency: string;
  message: string;
}
