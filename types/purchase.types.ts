export interface Purchase extends PurchaseExtras {
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

export interface PurchaseDetail extends Purchase, PurchaseDetailExtras {
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
  paymentMethod?: PaymentMethod;
  kind?: PurchaseKind;
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

export type PaymentMethod = "CARD" | "WALLET";
export type PurchaseKind = "ESIM" | "TOPUP";
export type ValidityState = "NOT_STARTED" | "ACTIVE" | "EXPIRED";

export interface PurchaseRef {
  id: string;
  packageName: string;
}

export interface PurchaseValidity {
  state: ValidityState | null;
  label: string | null;
  startBy: string | null;
  activatedAt: string | null;
  expiresAt: string | null;
  dataUsedBytes: number | null;
  dataTotalBytes: number | null;
  startRemindersSent: number[];
}

export interface PurchaseTopup {
  id: string;
  packageName: string;
  dataLabel?: string | null;
  durationDays?: number | null;
  price?: number | null;
  currency?: string | null;
  status?: string | null;
  paymentMethod?: PaymentMethod | string | null;
  purchasedAt?: string | null;
  validity?: Partial<PurchaseValidity> | null;
}

/** Fields added for wallet payments, top ups and validity. Optional so older API builds still work. */
export interface PurchaseExtras {
  paymentMethod?: PaymentMethod | string | null;
  isTopup?: boolean;
  topupOf?: PurchaseRef | null;
  validityState?: ValidityState | string | null;
}

export interface PurchaseDetailExtras extends PurchaseExtras {
  validity?: Partial<PurchaseValidity> | null;
  topups?: PurchaseTopup[] | null;
}
