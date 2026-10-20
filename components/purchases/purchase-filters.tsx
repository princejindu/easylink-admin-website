"use client";

import { OrderStatus } from "@/enums/order-status.enum";
import { EsimProvider } from "@/enums/esim-provider.enum";

interface PurchaseFiltersProps {
  statusFilter: string;
  onStatusFilter: (value: string) => void;
  providerFilter: string;
  onProviderFilter: (value: string) => void;
  startDate: string;
  onStartDate: (value: string) => void;
  endDate: string;
  onEndDate: (value: string) => void;
  paymentFilter: string;
  onPaymentFilter: (value: string) => void;
  kindFilter: string;
  onKindFilter: (value: string) => void;
}

export function PurchaseFilters({
  statusFilter,
  onStatusFilter,
  providerFilter,
  onProviderFilter,
  startDate,
  onStartDate,
  endDate,
  onEndDate,
  paymentFilter,
  onPaymentFilter,
  kindFilter,
  onKindFilter,
}: PurchaseFiltersProps) {
  return (
    <div className="flex flex-wrap gap-3">
      <select
        value={statusFilter}
        onChange={(e) => onStatusFilter(e.target.value)}
        className="px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
      >
        <option value="">All Statuses</option>
        <option value={OrderStatus.PENDING}>Pending</option>
        <option value={OrderStatus.PREPARING}>Preparing</option>
        <option value={OrderStatus.SHIPPED}>Shipped</option>
        <option value={OrderStatus.ACTIVE}>Active</option>
        <option value={OrderStatus.COMPLETED}>Completed</option>
        <option value={OrderStatus.FAILED}>Failed</option>
        <option value={OrderStatus.CANCELLED}>Cancelled</option>
        <option value={OrderStatus.REFUNDED}>Refunded</option>
      </select>

      <select
        value={providerFilter}
        onChange={(e) => onProviderFilter(e.target.value)}
        className="px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
      >
        <option value="">All Providers</option>
        <option value={EsimProvider.TRANSATEL}>Transatel</option>
        <option value={EsimProvider.TELNA}>Telna</option>
      </select>

      <select
        value={paymentFilter}
        onChange={(e) => onPaymentFilter(e.target.value)}
        aria-label="Payment method"
        className="px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
      >
        <option value="">All Payments</option>
        <option value="CARD">Card</option>
        <option value="WALLET">Commission wallet</option>
      </select>

      <select
        value={kindFilter}
        onChange={(e) => onKindFilter(e.target.value)}
        aria-label="Purchase type"
        className="px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
      >
        <option value="">All Types</option>
        <option value="ESIM">eSIM</option>
        <option value="TOPUP">Top up</option>
      </select>

      <input
        type="date"
        value={startDate}
        onChange={(e) => onStartDate(e.target.value)}
        placeholder="Start date"
        className="px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
      />

      <input
        type="date"
        value={endDate}
        onChange={(e) => onEndDate(e.target.value)}
        placeholder="End date"
        className="px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
      />
    </div>
  );
}
