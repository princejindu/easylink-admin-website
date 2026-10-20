"use client";

import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { Pagination } from "@/components/shared/pagination";
import { PurchaseTable } from "@/components/purchases/purchase-table";
import { PurchaseFilters } from "@/components/purchases/purchase-filters";
import { purchasesApi } from "@/lib/api/purchases.api";
import { showError } from "@/lib/utils/toast.util";
import type { Purchase, PaymentMethod, PurchaseKind } from "@/types/purchase.types";

const PAGE_SIZE = 20;

export default function PurchasesPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [providerFilter, setProviderFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");
  const [kindFilter, setKindFilter] = useState("");

  const fetchPurchases = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await purchasesApi.list({
        page,
        limit: PAGE_SIZE,
        status: statusFilter || undefined,
        provider: providerFilter || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        paymentMethod: (paymentFilter || undefined) as PaymentMethod | undefined,
        kind: (kindFilter || undefined) as PurchaseKind | undefined,
      });
      setPurchases(response.data ?? []);
      setTotal(response.meta?.total ?? 0);
    } catch {
      showError("Failed to load purchases");
    } finally {
      setIsLoading(false);
    }
  }, [page, statusFilter, providerFilter, startDate, endDate, paymentFilter, kindFilter]);

  useEffect(() => {
    fetchPurchases();
  }, [fetchPurchases]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Purchases"
        description="View and manage all eSIM purchases and top ups"
      />

      <PurchaseFilters
        statusFilter={statusFilter}
        onStatusFilter={(v) => {
          setStatusFilter(v);
          setPage(1);
        }}
        providerFilter={providerFilter}
        onProviderFilter={(v) => {
          setProviderFilter(v);
          setPage(1);
        }}
        startDate={startDate}
        onStartDate={(v) => {
          setStartDate(v);
          setPage(1);
        }}
        endDate={endDate}
        onEndDate={(v) => {
          setEndDate(v);
          setPage(1);
        }}
        paymentFilter={paymentFilter}
        onPaymentFilter={(v) => {
          setPaymentFilter(v);
          setPage(1);
        }}
        kindFilter={kindFilter}
        onKindFilter={(v) => {
          setKindFilter(v);
          setPage(1);
        }}
      />

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <>
          <PurchaseTable purchases={purchases} onRefresh={fetchPurchases} />
          <Pagination
            page={page}
            pageSize={PAGE_SIZE}
            total={total}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
}
