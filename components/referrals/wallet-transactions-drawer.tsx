"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { Pagination } from "@/components/shared/pagination";
import { referralsApi } from "@/lib/api/referrals.api";
import { formatCurrency, formatDate, formatDateTime } from "@/lib/utils/format.util";
import { StatusBadge } from "@/components/shared/status-badge";
import { BADGE_STATUS, TRANSACTION_LABEL, toStatusKind } from "@/components/referrals/referral-status";
import { showError } from "@/lib/utils/toast.util";
import { getErrorMessage } from "@/lib/utils/error.util";
import { cn } from "@/lib/utils/cn";
import type { ReferralWallet, WalletTransaction } from "@/types/referrals.types";

const PAGE_SIZE = 20;
const DEBIT_HINTS = ["DEBIT", "SPEND", "PURCHASE", "WITHDRAW", "REVERSAL"];

/** Totals are optional so the drawer can open from the user page, which only has balances. */
export type DrawerWallet = Pick<
  ReferralWallet,
  "userId" | "name" | "email" | "availableBalance" | "pendingBalance"
> &
  Partial<Pick<ReferralWallet, "totalEarned" | "totalSpent">>;

interface WalletTransactionsDrawerProps {
  wallet: DrawerWallet;
  onClose: () => void;
}

function isDebit(tx: WalletTransaction): boolean {
  if (tx.amount < 0) return true;
  const type = tx.type.toUpperCase();
  return DEBIT_HINTS.some((hint) => type.includes(hint));
}

function formatType(type: string): string {
  const words = type.toLowerCase().split("_").join(" ");
  return words.charAt(0).toUpperCase() + words.slice(1);
}

export function WalletTransactionsDrawer({ wallet, onClose }: WalletTransactionsDrawerProps) {
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const requestId = useRef(0);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const fetchTransactions = useCallback(async () => {
    const id = ++requestId.current;
    setIsLoading(true);
    try {
      const response = await referralsApi.listWalletTransactions(wallet.userId, {
        page,
        limit: PAGE_SIZE,
      });
      if (id !== requestId.current) return;
      setTransactions(response.data);
      setTotal(response.meta?.total ?? response.data.length);
    } catch (error) {
      if (id !== requestId.current) return;
      showError(getErrorMessage(error, "Failed to load wallet transactions"));
    } finally {
      if (id === requestId.current) setIsLoading(false);
    }
  }, [wallet.userId, page]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  useEffect(() => {
    closeButtonRef.current?.focus();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="wallet-drawer-title"
        className="relative h-full w-full max-w-xl bg-background border-l shadow-xl flex flex-col"
      >
        <header className="flex items-start justify-between gap-4 p-6 border-b">
          <div className="min-w-0">
            <h2 id="wallet-drawer-title" className="text-lg font-semibold truncate">
              {wallet.name || "Unnamed user"}
            </h2>
            <p className="text-sm text-muted-foreground truncate">{wallet.email}</p>
          </div>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            aria-label="Close"
            className="p-2 rounded-lg hover:bg-accent transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </header>

        <dl className="grid grid-cols-2 sm:grid-cols-4 border-b">
          {[
            { label: "Available", value: wallet.availableBalance, strong: true },
            { label: "Pending", value: wallet.pendingBalance },
            { label: "Total earned", value: wallet.totalEarned },
            { label: "Total spent", value: wallet.totalSpent },
          ]
            .filter((stat) => typeof stat.value === "number")
            .map((stat) => (
            <div key={stat.label} className="p-4 border-r border-b sm:border-b-0 last:border-r-0">
              <dt className="text-xs text-muted-foreground">{stat.label}</dt>
              <dd className={cn("tabular-nums", stat.strong ? "text-xl font-semibold" : "text-base font-medium")}>
                {formatCurrency(stat.value as number)}
              </dd>
            </div>
          ))}
        </dl>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          <h3 className="text-sm font-semibold mb-3">Transactions</h3>
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <LoadingSpinner size="lg" />
            </div>
          ) : !transactions.length ? (
            <p className="py-16 text-center text-sm text-muted-foreground">
              No wallet transactions yet.
            </p>
          ) : (
            <ul className="divide-y">
              {transactions.map((tx) => {
                const debit = isDebit(tx);
                const magnitude = Math.abs(tx.amount);
                const kind = toStatusKind(tx.status);
                return (
                  <li key={tx.id} className="py-3 flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-medium">{formatType(tx.type)}</span>
                        <StatusBadge
                          status={BADGE_STATUS[kind]}
                          label={kind === "unknown" ? tx.status : TRANSACTION_LABEL[kind]}
                        />
                      </div>
                      {kind === "pending" && tx.availableAt && (
                        <div className="text-xs text-yellow-700 dark:text-yellow-400">
                          Releases {formatDate(tx.availableAt)}
                        </div>
                      )}
                      {tx.description && (
                        <div className="text-xs text-muted-foreground">{tx.description}</div>
                      )}
                      <div className="text-xs text-muted-foreground">
                        {formatDateTime(tx.createdAt)}
                        {tx.reference && (
                          <span className="ml-2 font-mono break-all">{tx.reference}</span>
                        )}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div
                        className={cn(
                          "text-sm font-semibold tabular-nums",
                          debit ? "text-red-600 dark:text-red-400" : "text-green-700 dark:text-green-400",
                          kind === "cancelled" && "line-through opacity-60"
                        )}
                      >
                        {debit ? "-" : "+"}
                        {formatCurrency(magnitude)}
                      </div>
                      <div className="text-xs text-muted-foreground tabular-nums">
                        Balance {formatCurrency(tx.balanceAfter)}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="px-6 border-t">
          <Pagination page={page} pageSize={PAGE_SIZE} total={total} onPageChange={setPage} />
        </div>
      </aside>
    </div>
  );
}
