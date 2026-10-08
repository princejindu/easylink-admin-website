"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { Pagination } from "@/components/shared/pagination";
import { CommissionRateCard } from "@/components/referrals/commission-rate-card";
import { CommissionTable } from "@/components/referrals/commission-table";
import { referralsApi } from "@/lib/api/referrals.api"
import { showError } from "@/lib/utils/toast.util";
import { getErrorMessage } from "@/lib/utils/error.util";
import type { Commission } from "@/types/referrals.types";

const PAGE_SIZE = 20;

export default function ReferralsPage() {
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
    setIsLoading(true);
    fetchCommissions();
  }, [fetchCommissions]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Referrals"
        description="Manage referral commissions and rates"
      />

      <CommissionRateCard
        commissionPercent={commissionPercent}
        onUpdated={(percent) => {
          setCommissionPercent(percent);
          fetchCommissions();
        }}
      />

      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Commissions</h2>
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <>
            <CommissionTable
              commissions={commissions}
              onRefresh={fetchCommissions}
            />
            <Pagination
              page={page}
              pageSize={PAGE_SIZE}
              total={total}
              onPageChange={setPage}
            />
          </>
        )}
      </div>
    </div>
  );
}
