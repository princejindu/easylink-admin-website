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
  /** Set by the API when the order is under a Stripe dispute (chargeback). */
  disputed?: boolean;
  dispute?: PurchaseDispute | null;
}

export interface PurchaseDispute {
  id?: string;
  status?: string;
  reason?: string;
  evidenceDueBy?: string | null;
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
  /** Evidence fields for disputes. */
  paidAt?: string | null;
  deliveredAt?: string | null;
  activatedAt?: string | null;
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
