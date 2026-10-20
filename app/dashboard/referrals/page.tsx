"use client";

import { Suspense, useState, useEffect, useCallback, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { Pagination } from "@/components/shared/pagination";
import { CommissionRateCard } from "@/components/referrals/commission-rate-card";
import { CommissionTable } from "@/components/referrals/commission-table";
import { WalletsSection } from "@/components/referrals/wallets-section";
import { referralsApi } from "@/lib/api/referrals.api";
import { cn } from "@/lib/utils/cn";
import { showError } from "@/lib/utils/toast.util";
import { getErrorMessage } from "@/lib/utils/error.util";
import type { Commission } from "@/types/referrals.types";

const PAGE_SIZE = 20;

const TABS = [
  { id: "commissions", label: "Commissions" },
  { id: "wallets", label: "Wallets" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function ReferralsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-20">
          <LoadingSpinner size="lg" />
        </div>
      }
    >
      <ReferralsContent />
    </Suspense>
  );
}

function ReferralsContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeTab: TabId =
    searchParams.get("tab") === "wallets" ? "wallets" : "commissions";

  const selectTab = (tab: TabId) => {
    const params = new URLSearchParams(searchParams.toString());
    if (tab === "commissions") params.delete("tab");
    else params.set("tab", tab);
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  const [isLoading, setIsLoading] = useState(true);
  const [commissionPercent, setCommissionPercent] = useState<number>(0);
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const commissionsRequestId = useRef(0);

  const fetchCommissions = useCallback(async () => {
    const requestId = ++commissionsRequestId.current;

    try {
      const response = await referralsApi.listCommissions({
        page,
        limit: PAGE_SIZE,
      });
      if (requestId !== commissionsRequestId.current) return;
      if (!response) return;
      const list = response.data ?? [];
      setCommissions(list);
      setTotal(response.meta?.total ?? list.length);
    } catch (error) {
      if (requestId !== commissionsRequestId.current) return;
      showError(getErrorMessage(error, "Failed to load commissions"));
    } finally {
      if (requestId === commissionsRequestId.current) {
        setIsLoading(false);
      }
    }
  }, [page]);

  const fetchRate = useCallback(async () => {
    try {
      const rate = await referralsApi.getCommissionRate();
      if (!rate) return;
      setCommissionPercent(rate.commissionPercent);
    } catch (error) {
      showError(getErrorMessage(error, "Failed to load commission rate"));
    }
  }, []);

  useEffect(() => {
    fetchRate();
  }, [fetchRate]);

  useEffect(() => {
    if (activeTab !== "commissions") return;
    setIsLoading(true);
    fetchCommissions();
  }, [fetchCommissions, activeTab]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Referrals"
        description="Commission rate, commissions and referral wallets"
      />

      <CommissionRateCard
        commissionPercent={commissionPercent}
        onUpdated={(percent) => {
          setCommissionPercent(percent);
          fetchCommissions();
        }}
      />

      <div className="space-y-4">
        <div role="tablist" aria-label="Referral views" className="flex gap-1 border-b">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              id={`tab-${tab.id}`}
              aria-selected={activeTab === tab.id}
              aria-controls={`panel-${tab.id}`}
              onClick={() => selectTab(tab.id)}
              className={cn(
                "px-4 py-2 -mb-px text-sm font-medium border-b-2 transition-colors",
                activeTab === tab.id
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "commissions" ? (
          <section id="panel-commissions" role="tabpanel" aria-labelledby="tab-commissions" className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Commissions are credited to the referrer&apos;s wallet as Pending and become
              Available automatically 14 days after the eSIM is delivered. Cancelled means the
              order was refunded.
            </p>
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <LoadingSpinner size="lg" />
              </div>
            ) : (
              <>
                <CommissionTable commissions={commissions} />
                <Pagination
                  page={page}
                  pageSize={PAGE_SIZE}
                  total={total}
                  onPageChange={setPage}
                />
              </>
            )}
          </section>
        ) : (
          <section id="panel-wallets" role="tabpanel" aria-labelledby="tab-wallets">
            <WalletsSection />
          </section>
        )}
      </div>
    </div>
  );
}
