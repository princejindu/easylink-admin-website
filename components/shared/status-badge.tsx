"use client";

import { cn } from "@/lib/utils/cn";

interface StatusBadgeProps {
  status: string;
  label?: string;
  className?: string;
}

function getStatusConfig(status: string): { label: string; classes: string } {
  switch (status) {
    case "active":
      return {
        label: "Active",
        classes: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      };
    case "suspended":
      return {
        label: "Suspended",
        classes: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
      };
    case "paid":
      return {
        label: "Paid",
        classes: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      };
    case "pending":
      return {
        label: "Pending",
        classes: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
      };
    case "preparing":
      return {
        label: "Preparing",
        classes: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      };
    case "expired":
      return {
        label: "Expired",
        classes: "bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-400",
      };
    case "failed":
      return {
        label: "Failed",
        classes: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
      };
    case "shipped":
      return {
        label: "Shipped",
        classes: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
      };
    case "completed":
      return {
        label: "Completed",
        classes: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      };
    case "cancelled":
      return {
        label: "Cancelled",
        classes: "bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-400",
      };
    case "refunded":
      return {
        label: "Refunded",
        classes: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
      };
    default:
      return {
        label: status,
        classes: "bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-400",
      };
  }
}

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  const config = getStatusConfig(status);

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        config.classes,
        className
      )}
    >
      {label ?? config.label}
    </span>
  );
}
