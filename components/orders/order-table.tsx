"use client";

import { StatusBadge } from "@/components/shared/status-badge";
import { formatDateTime, formatCurrency } from "@/lib/utils/format.util";
import type { Order } from "@/types/order.types";

interface OrderTableProps {
  orders: Order[];
  onRefresh: () => void;
}

export function OrderTable({ orders }: OrderTableProps) {
  if (!orders.length) {
    return (
      <div className="bg-card border rounded-lg p-12 text-center text-muted-foreground">
        No orders found.
      </div>
    );
  }

  return (
    <div className="bg-card border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                Order
              </th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">
                Customer
              </th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden sm:table-cell">
                Package
              </th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden lg:table-cell">
                Provider
              </th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                Amount
              </th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                Status
              </th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden xl:table-cell">
                Date
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                className="border-b last:border-0 hover:bg-accent/50 transition-colors"
              >
                <td className="px-4 py-3 font-mono text-xs font-medium">
                  {order.id.slice(0, 8).toUpperCase()}
                </td>
                <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                  {order.user
                    ? `${order.user.firstName} ${order.user.lastName}`
                    : order.userId.slice(0, 8)}
                </td>
                <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">
                  {order.packageName || order.packageId.slice(0, 8)}
                </td>
                <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell capitalize">
                  {order.provider}
                </td>
                <td className="px-4 py-3 font-medium">
                  {formatCurrency(order.amountGbp)}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={order.status} />
                </td>
                <td className="px-4 py-3 text-muted-foreground hidden xl:table-cell">
                  {formatDateTime(order.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
