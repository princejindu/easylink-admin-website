"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Search } from "lucide-react";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { Pagination } from "@/components/shared/pagination";
import { WalletTable } from "@/components/referrals/wallet-table";
import { WalletTransactionsDrawer } from "@/components/referrals/wallet-transactions-drawer";
import { ReleaseDueButton } from "@/components/referrals/release-due-button";
import { referralsApi } from "@/lib/api/referrals.api";
import { showError } from "@/lib/utils/toast.util";
import { getErrorMessage } from "@/lib/utils/error.util";
import type { ReferralWallet } from "@/types/referrals.types";

const PAGE_SIZE = 20;

export function WalletsSection() {
  const [wallets, setWallets] = useState<ReferralWallet[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<ReferralWallet | null>(null);
  const requestId = useRef(0);

  const fetchWallets = useCallback(async () => {
    const id = ++requestId.current;
    setIsLoading(true);
    try {
      const response = await referralsApi.listWallets({ page, limit: PAGE_SIZE });
      if (id !== requestId.current) return;
      setWallets(response.data);
      setTotal(response.meta?.total ?? response.data.length);
    } catch (error) {
      if (id !== requestId.current) return;
      showError(getErrorMessage(error, "Failed to load wallets"));
    } finally {
      if (id === requestId.current) setIsLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchWallets();
  }, [fetchWallets]);

  // The wallets endpoint has no search parameter, so this filters the loaded page only.
  const visibleWallets = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return wallets;
    return wallets.filter(
      (w) =>
        (w.name ?? "").toLowerCase().includes(term) ||
        (w.email ?? "").toLowerCase().includes(term)
    );
  }, [wallets, search]);

  const closeDrawer = useCallback(() => setSelected(null), []);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-start justify-between gap-3">
      <div className="space-y-1 flex-1 min-w-[16rem]">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="search"
            aria-label="Filter wallets by name or email"
            placeholder="Filter this page by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Search filters the current page only.
        </p>
      </div>
        <ReleaseDueButton onReleased={fetchWallets} />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <>
          <WalletTable
            wallets={visibleWallets}
            emptyMessage={
              search.trim() ? "No wallets on this page match your search." : "No wallets yet."
            }
            onSelect={setSelected}
          />
          <Pagination page={page} pageSize={PAGE_SIZE} total={total} onPageChange={setPage} />
        </>
      )}

      {selected && <WalletTransactionsDrawer wallet={selected} onClose={closeDrawer} />}
    </div>
  );
}
