"use client";

import Link from "next/link";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { Pagination } from "@/components/shared/pagination";
import { ROUTES } from "@/constants/routes.constants";
import { USER_TAB_PAGE_SIZE } from "@/components/users/tabs/use-user-page";
import type { UserRef } from "@/types/user.types";

export const TH = "text-left px-4 py-3 font-medium text-muted-foreground";
export const TD = "px-4 py-3 align-top";

interface TabShellProps {
  isLoading: boolean;
  failed: boolean;
  isEmpty: boolean;
  emptyMessage: string;
  page: number;
  total: number;
  onPageChange: (page: number) => void;
  toolbar?: React.ReactNode;
  children: React.ReactNode;
}

/** Loading, empty and error states plus pagination around a user tab table. */
export function TabShell({
  isLoading,
  failed,
  isEmpty,
  emptyMessage,
  page,
  total,
  onPageChange,
  toolbar,
  children,
}: TabShellProps) {
  return (
    <div className="space-y-3">
      {toolbar}
      <div className="bg-card border rounded-lg overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <LoadingSpinner size="lg" />
          </div>
        ) : failed ? (
          <div className="p-8 text-center text-muted-foreground text-sm">
            Could not load this list. The API may not support it yet.
          </div>
        ) : isEmpty ? (
          <div className="p-8 text-center text-muted-foreground text-sm">{emptyMessage}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">{children}</table>
          </div>
        )}
      </div>
      {!isLoading && !failed && (
        <Pagination
          page={page}
          pageSize={USER_TAB_PAGE_SIZE}
          total={total}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}

export function UserLink({ user }: { user?: UserRef | null }) {
  if (!user?.id) return <span className="text-muted-foreground">N/A</span>;
  return (
    <div>
      <Link href={ROUTES.USER_DETAIL(user.id)} className="font-medium text-primary hover:underline">
        {user.name || user.email || "Unnamed user"}
      </Link>
      {user.name && user.email && (
        <div className="text-xs text-muted-foreground">{user.email}</div>
      )}
    </div>
  );
}

export function PurchaseLink({ id, label }: { id?: string | null; label?: string | null }) {
  if (!id) return <span className="text-muted-foreground">N/A</span>;
  return (
    <Link href={ROUTES.PURCHASE_DETAIL(id)} className="text-primary hover:underline">
      {label || "View purchase"}
    </Link>
  );
}

export const FILTER_CLASS =
  "px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary";
