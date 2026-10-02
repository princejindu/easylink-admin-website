"use client";

import { cn } from "@/lib/utils/cn";

interface StatusBadgeProps {
  status: string;
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
    case "cancelled":
      return {
        label: "Cancelled",
        classes: "bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-400",
      };
    default:
      return {
        label: status,
        classes: "bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-400",
      };
  }
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = getStatusConfig(status);

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        config.classes,
        className
      )}
    >
      {config.label}
    </span>
  );
}
