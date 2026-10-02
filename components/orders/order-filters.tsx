"use client";

import { OrderStatus } from "@/enums/order-status.enum";
import { EsimProvider } from "@/enums/esim-provider.enum";

interface OrderFiltersProps {
  statusFilter: OrderStatus | "";
  onStatusFilter: (value: OrderStatus | "") => void;
  providerFilter: EsimProvider | "";
  onProviderFilter: (value: EsimProvider | "") => void;
  dateFrom: string;
  onDateFrom: (value: string) => void;
  dateTo: string;
  onDateTo: (value: string) => void;
}

export function OrderFilters({
  statusFilter,
  onStatusFilter,
  providerFilter,
  onProviderFilter,
  dateFrom,
  onDateFrom,
  dateTo,
  onDateTo,
}: OrderFiltersProps) {
  return (
    <div className="flex flex-wrap gap-3">
      <select
        value={statusFilter}
        onChange={(e) => onStatusFilter(e.target.value as OrderStatus | "")}
        className="px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
      >
        <option value="">All Statuses</option>
        <option value={OrderStatus.PENDING}>Pending</option>
        <option value={OrderStatus.PREPARING}>Preparing</option>
        <option value={OrderStatus.ACTIVE}>Active</option>
        <option value={OrderStatus.EXPIRED}>Expired</option>
        <option value={OrderStatus.FAILED}>Failed</option>
        <option value={OrderStatus.CANCELLED}>Cancelled</option>
      </select>

      <select
        value={providerFilter}
        onChange={(e) => onProviderFilter(e.target.value as EsimProvider | "")}
        className="px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
      >
        <option value="">All Providers</option>
        <option value={EsimProvider.TRANSATEL}>Transatel</option>
        <option value={EsimProvider.TELNA}>Telna</option>
      </select>

      <input
        type="date"
        value={dateFrom}
        onChange={(e) => onDateFrom(e.target.value)}
        placeholder="From date"
        className="px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
      />

      <input
        type="date"
        value={dateTo}
        onChange={(e) => onDateTo(e.target.value)}
        placeholder="To date"
        className="px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
      />
    </div>
  );
}
