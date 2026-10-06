"use client";

import { useState, useEffect } from "react";
import { Users, ShoppingCart, TrendingUp, DollarSign } from "lucide-react";
import { StatsCard } from "@/components/shared/stats-card";
import { PageHeader } from "@/components/shared/page-header";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { analyticsApi } from "@/lib/api/analytics.api";
import { showError } from "@/lib/utils/toast.util";
import { formatCurrency, formatNumber } from "@/lib/utils/format.util";
import type { AnalyticsOverview } from "@/types/analytics.types";

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const data = await analyticsApi.overview();
        // Adapt if needed
        if ((data as any).totalUsers !== undefined) {
          (data as any).users = {
            total: (data as any).totalUsers,
            newToday: 0,
            newThisWeek: 0,
            newThisMonth: 0,
          };
          (data as any).purchases = {
            today: (data as any).purchasesToday,
            thisWeek: (data as any).purchasesThisWeek,
            thisMonth: (data as any).purchasesThisMonth,
          };
          (data as any).revenue = {
            today: (data as any).revenueToday,
            thisWeek: (data as any).revenueThisWeek,
            thisMonth: (data as any).revenueThisMonth,
            currency: 'GBP',
          };
        }
        setOverview(data);
      } catch {
        showError("Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOverview();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Dashboard"
        description="Overview of EasyLink platform performance"
      />

      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Users"
          value={formatNumber(overview?.users?.total ?? 0)}
          icon={Users}
        />
        <StatsCard
          title="Purchases Today"
          value={formatNumber(overview?.purchases?.today ?? 0)}
          icon={ShoppingCart}
        />
        <StatsCard
          title="Purchases This Month"
          value={formatNumber(overview?.purchases?.thisMonth ?? 0)}
          icon={TrendingUp}
        />
        <StatsCard
          title="Revenue This Month"
          value={formatCurrency(overview?.revenue?.thisMonth ?? 0)}
          icon={DollarSign}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Top Packages</h2>
          {!((overview as any)?.topPackages?.length) ? (
            <p className="text-sm text-muted-foreground">No data available.</p>
          ) : (
            <div className="space-y-3">
              {((overview as any).topPackages || []).map((pkg: any, index: number) => (
                <div
                  key={pkg.packageId}
                  className="flex items-center justify-between py-2 border-b last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-muted-foreground w-5">
                      {index + 1}.
                    </span>
                    <span className="text-sm font-medium">{pkg.packageName}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">{formatNumber(pkg.purchaseCount ?? (pkg as any).count)} sales</p>
                    <p className="text-xs text-muted-foreground">
                      {formatCurrency(pkg.revenue)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-card border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Purchases by Country</h2>
          {!((overview as any)?.purchasesByCountry?.length) ? (
            <p className="text-sm text-muted-foreground">No data available.</p>
          ) : (
            <div className="space-y-3">
              {((overview as any).purchasesByCountry || []).slice(0, 8).map((item: any) => (
                <div
                  key={item.purchaseCount ?? item.countryName ?? item.purchaseCount ?? item.country}
                  className="flex items-center justify-between py-2 border-b last:border-0"
                >
                  <span className="text-sm font-medium">{item.purchaseCount ?? item.countryName ?? item.purchaseCount ?? item.country}</span>
                  <div className="text-right">
                    <p className="text-sm font-semibold">{formatNumber(item.purchaseCount ?? item.count)}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatCurrency(item.revenue)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
