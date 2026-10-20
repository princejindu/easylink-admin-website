"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  RefreshCw,
  XCircle,
  AlertCircle,
  User,
  Package,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { StatusBadge } from "@/components/shared/status-badge";
import { DisputedBadge } from "@/components/purchases/disputed-badge";
import { DisputeEvidenceCard } from "@/components/purchases/dispute-evidence-card";
import {
  PaymentMethodBadge,
  PurchaseKindBadge,
} from "@/components/purchases/purchase-badges";
import { ValidityCard } from "@/components/purchases/validity-card";
import { TopupsCard } from "@/components/purchases/topups-card";
import { isDisputed } from "@/lib/utils/dispute.util";
import { purchasesApi } from "@/lib/api/purchases.api";
import { showSuccess, showError } from "@/lib/utils/toast.util";
import { formatDateTime, formatDateTime12, formatCurrency } from "@/lib/utils/format.util";
import { ROUTES } from "@/constants/routes.constants";
import type { PurchaseDetail, CancelPurchaseResponse } from "@/types/purchase.types";

export default function PurchaseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const purchaseId = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [purchase, setPurchase] = useState<PurchaseDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncCooldown, setSyncCooldown] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelResult, setCancelResult] = useState<CancelPurchaseResponse | null>(null);
  const [cancelPartialError, setCancelPartialError] = useState(false);
  const [showMetadata, setShowMetadata] = useState(false);

  const fetchPurchase = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await purchasesApi.detail(purchaseId);
      setPurchase(data);
    } catch (err: unknown) {
      const apiErr = err as { statusCode?: number; message?: string };
      if (apiErr?.statusCode === 404) {
        setError("Purchase not found.");
      } else {
        setError(apiErr?.message ?? "Failed to load purchase.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [purchaseId]);

  useEffect(() => {
    fetchPurchase();
  }, [fetchPurchase]);

  const handleSync = async () => {
    if (isSyncing || syncCooldown) return;
    setIsSyncing(true);
    try {
      const result = await purchasesApi.sync(purchaseId);
      showSuccess(result.message ?? "Status synced.");
      setPurchase((prev) =>
        prev ? { ...prev, status: result.status, updatedAt: result.updatedAt } : prev
      );
      setSyncCooldown(true);
      setTimeout(() => setSyncCooldown(false), 5000);
    } catch (err: unknown) {
      const apiErr = err as { statusCode?: number; message?: string };
      if (apiErr?.statusCode === 502) {
        showError("Provider unavailable, try again shortly.");
      } else if (apiErr?.statusCode === 400) {
        showError("This purchase cannot be synced in its current state.");
      } else {
        showError(apiErr?.message ?? "Sync failed.");
      }
    } finally {
      setIsSyncing(false);
    }
  };

  const handleCancel = async () => {
    setIsCancelling(true);
    setCancelPartialError(false);
    try {
      const result = await purchasesApi.cancel(purchaseId);
      setCancelResult(result);
      setPurchase((prev) =>
        prev ? { ...prev, status: result.status, canCancel: false } : prev
      );
      showSuccess(result.message ?? "Order cancelled and refund issued.");
      setShowCancelModal(false);
    } catch (err: unknown) {
      const apiErr = err as { statusCode?: number; message?: string };
      if (apiErr?.statusCode === 500) {
        setCancelPartialError(true);
        setPurchase((prev) =>
          prev ? { ...prev, status: "cancelled", canCancel: false } : prev
        );
        setShowCancelModal(false);
      } else if (apiErr?.statusCode === 502) {
        showError("Provider unavailable during cancellation. Try again shortly.");
      } else {
        showError(apiErr?.message ?? "Cancellation failed.");
      }
    } finally {
      setIsCancelling(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !purchase) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => router.push(ROUTES.PURCHASES)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Purchases
        </button>
        <div className="bg-card border rounded-lg p-12 text-center">
          <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">{error ?? "Purchase not found."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push(ROUTES.PURCHASES)}
            className="p-2 rounded-lg border border-input hover:bg-accent transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <PageHeader
            title="Purchase Details"
            description={`ID: ${purchase.id}`}
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSync}
            disabled={isSyncing || syncCooldown}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-input text-sm font-medium hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSyncing ? (
              <LoadingSpinner size="sm" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            {isSyncing ? "Syncing..." : "Sync Status"}
          </button>

          {purchase.canCancel && (
            <button
              onClick={() => setShowCancelModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors"
            >
              <XCircle className="w-4 h-4" />
              Cancel &amp; Refund
            </button>
          )}
        </div>
      </div>

      {/* Partial cancel error warning */}
      {cancelPartialError && (
        <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-sm text-amber-800 dark:text-amber-300">
          <strong>Order cancelled but refund failed.</strong> Please process the
          refund manually in Stripe.
        </div>
      )}

      {/* Cancel success info */}
      {cancelResult && !cancelPartialError && (
        <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-sm text-green-800 dark:text-green-300">
          Order cancelled. Refund of{" "}
          <strong>
            {formatCurrency(cancelResult.refundAmount, cancelResult.currency)}
          </strong>{" "}
          issued (Stripe refund id: {cancelResult.refundId}). May take 5 to 10 business days to
          appear on the card.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Purchase info */}
        <div className="bg-card border rounded-lg p-6 space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
            <Package className="w-4 h-4" />
            Purchase Info
          </div>

          <div className="space-y-3 text-sm">
            <Row label="Status">
              <span className="inline-flex flex-wrap items-center justify-end gap-1">
                <StatusBadge status={purchase.status} />
                {isDisputed(purchase) && <DisputedBadge />}
              </span>
            </Row>
            <Row label="Order number">
              <span className="font-mono text-xs">{purchase.orderReference || "N/A"}</span>
            </Row>
            <Row label="Package">{purchase.packageName}</Row>
            {purchase.isTopup !== undefined && purchase.isTopup !== null && (
              <Row label="Type">
                <PurchaseKindBadge isTopup={purchase.isTopup} />
              </Row>
            )}
            {purchase.isTopup && purchase.topupOf?.id && (
              <Row label="Top up of">
                <button
                  onClick={() => router.push(ROUTES.PURCHASE_DETAIL(purchase.topupOf!.id))}
                  className="text-primary hover:underline"
                >
                  {purchase.topupOf.packageName || "Parent eSIM"}
                </button>
              </Row>
            )}
            <Row label="Provider package id">
              <span className="font-mono text-xs">{purchase.packageId}</span>
            </Row>
            <Row label="Amount">
              {formatCurrency(purchase.amount, purchase.currency)}
            </Row>
            <Row label="Provider">
              <span className="capitalize">{purchase.provider}</span>
            </Row>
            <Row label={`${purchase.provider === "transatel" ? "Transatel" : "Telna"} order id`}>
              <span className="font-mono text-xs">{purchase.providerOrderId || "N/A"}</span>
            </Row>
            <Row label="Created">{formatDateTime(purchase.createdAt)}</Row>
            <Row label="Updated">{formatDateTime(purchase.updatedAt)}</Row>
          </div>
        </div>

        {/* Customer info */}
        <div className="bg-card border rounded-lg p-6 space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
            <User className="w-4 h-4" />
            Customer
          </div>

          <div className="space-y-3 text-sm">
            <Row label="Name">
              <button
                onClick={() => router.push(ROUTES.USER_DETAIL(purchase.userId))}
                className="text-primary hover:underline"
              >
                {purchase.userName}
              </button>
            </Row>
            <Row label="Email">{purchase.userEmail}</Row>
            <Row label="User ID">
              <span className="font-mono text-xs">{purchase.userId}</span>
            </Row>
          </div>
        </div>

        <DisputeEvidenceCard purchase={purchase} disputed={isDisputed(purchase)} />

        {/* Payment info */}
        <div className="bg-card border rounded-lg p-6 space-y-4">
          <div className="text-sm font-semibold text-muted-foreground">
            Payment
          </div>
          <div className="space-y-3 text-sm">
            {purchase.paymentMethod && (
              <Row label="Paid with">
                <PaymentMethodBadge method={purchase.paymentMethod} />
              </Row>
            )}
            {purchase.paidAt && (
              <Row label="Paid at">{formatDateTime12(purchase.paidAt)}</Row>
            )}
            <Row label="Stripe payment id">
              <span className="font-mono text-xs">
                {purchase.stripePaymentIntentId ?? "N/A"}
              </span>
            </Row>
            <Row label="Stripe charge id">
              <span className="font-mono text-xs">
                {purchase.stripeChargeId ?? "N/A"}
              </span>
            </Row>
          </div>
        </div>

        {/* eSIM info */}
        <div className="bg-card border rounded-lg p-6 space-y-4">
          <div className="text-sm font-semibold text-muted-foreground">
            eSIM Details
          </div>
          <div className="space-y-3 text-sm">
            <Row label="ICCID">
              <span className="font-mono text-xs">{purchase.iccid ?? "Not assigned"}</span>
            </Row>
            <Row label="APN">{purchase.apn ?? "N/A"}</Row>
            {purchase.activationCode && (
              <Row label="Activation Code">
                <span className="font-mono text-xs break-all">
                  {purchase.activationCode}
                </span>
              </Row>
            )}
            {purchase.providerMetadata &&
              Object.keys(purchase.providerMetadata).length > 0 && (
                <div>
                  <button
                    onClick={() => setShowMetadata((v) => !v)}
                    aria-expanded={showMetadata}
                    className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showMetadata ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                    {showMetadata ? "Hide provider metadata" : "Show provider metadata"}
                  </button>
                  {showMetadata && (
                    <pre className="mt-1 p-2 rounded bg-muted text-xs overflow-x-auto">
                      {JSON.stringify(purchase.providerMetadata, null, 2)}
                    </pre>
                  )}
                </div>
              )}
          </div>
        </div>
      </div>

      <ValidityCard validity={purchase.validity} />

      {!purchase.isTopup && Array.isArray(purchase.topups) && (
        <TopupsCard topups={purchase.topups} />
      )}

      {/* QR code */}
      {purchase.qrCodeData && (
        <div className="bg-card border rounded-lg p-6 flex flex-col items-center gap-4">
          <p className="text-sm font-semibold text-muted-foreground">
            eSIM QR Code
          </p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={purchase.qrCodeData}
            alt="eSIM QR Code"
            className="w-48 h-48 object-contain"
          />
          <p className="text-xs text-muted-foreground">
            Scan to install the eSIM
          </p>
        </div>
      )}

      {/* Cancel modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-card border rounded-lg p-6 w-full max-w-md space-y-4 shadow-xl">
            <h2 className="text-lg font-semibold">Cancel &amp; Refund</h2>
            <p className="text-sm text-muted-foreground">
              This will cancel the order with{" "}
              <span className="font-medium text-foreground capitalize">
                {purchase.provider}
              </span>{" "}
              and issue a full Stripe refund of{" "}
              <span className="font-medium text-foreground">
                {formatCurrency(purchase.amount, purchase.currency)}
              </span>{" "}
              to the customer. This cannot be undone.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowCancelModal(false)}
                disabled={isCancelling}
                className="px-4 py-2 rounded-lg border border-input text-sm hover:bg-accent transition-colors disabled:opacity-50"
              >
                Back
              </button>
              <button
                onClick={handleCancel}
                disabled={isCancelling}
                className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isCancelling && <LoadingSpinner size="sm" />}
                Confirm Cancel &amp; Refund
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-2 justify-between">
      <span className="text-muted-foreground shrink-0">{label}</span>
      <span className="text-right">{children}</span>
    </div>
  );
}
