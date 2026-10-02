"use client";

import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { Pagination } from "@/components/shared/pagination";
import { PackageTable } from "@/components/packages/package-table";
import { packagesApi } from "@/lib/api/packages.api";
import { showError } from "@/lib/utils/toast.util";
import type { EsimPackage } from "@/types/package.types";

const PAGE_SIZE = 20;

export default function PackagesPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [packages, setPackages] = useState<EsimPackage[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  const fetchPackages = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await packagesApi.list({ page, limit: PAGE_SIZE });
      setPackages(response.packages);
      setTotal(response.total);
    } catch {
      showError("Failed to load packages");
    } finally {
      setIsLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchPackages();
  }, [fetchPackages]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="eSIM Packages"
        description="Manage packages from the active provider and control featured shelf"
      />

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <>
          <PackageTable packages={packages} onRefresh={fetchPackages} />
          <Pagination
            page={page}
            pageSize={PAGE_SIZE}
            total={total}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
}
