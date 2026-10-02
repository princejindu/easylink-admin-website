"use client";

import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { Pagination } from "@/components/shared/pagination";
import { OrderTable } from "@/components/orders/order-table";
import { OrderFilters } from "@/components/orders/order-filters";
import { ordersApi } from "@/lib/api/orders.api";
import { showError } from "@/lib/utils/toast.util";
import { OrderStatus } from "@/enums/order-status.enum";
import { EsimProvider } from "@/enums/esim-provider.enum";
import type { Order } from "@/types/order.types";

const PAGE_SIZE = 20;

export default function OrdersPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "">("");
  const [providerFilter, setProviderFilter] = useState<EsimProvider | "">("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await ordersApi.list({
        page,
        limit: PAGE_SIZE,
        status: statusFilter || undefined,
        provider: providerFilter || undefined,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
      });
      setOrders(response.orders);
      setTotal(response.total);
    } catch {
      showError("Failed to load orders");
    } finally {
      setIsLoading(false);
    }
  }, [page, statusFilter, providerFilter, dateFrom, dateTo]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return (
    <div className="space-y-6">
      <PageHeader title="Orders" description="View and manage all eSIM purchases" />

      <OrderFilters
        statusFilter={statusFilter}
        onStatusFilter={(v) => { setStatusFilter(v); setPage(1); }}
        providerFilter={providerFilter}
        onProviderFilter={(v) => { setProviderFilter(v); setPage(1); }}
        dateFrom={dateFrom}
        onDateFrom={(v) => { setDateFrom(v); setPage(1); }}
        dateTo={dateTo}
        onDateTo={(v) => { setDateTo(v); setPage(1); }}
      />

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <>
          <OrderTable orders={orders} onRefresh={fetchOrders} />
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
