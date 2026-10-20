"use client";

import { useState, useEffect } from "react";
import { Users, ShoppingCart, TrendingUp, DollarSign } from "lucide-react";
import { StatsCard } from "@/components/shared/stats-card";
import { PageHeader } from "@/components/shared/page-header";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { Skeleton } from "@/components/shared/skeleton";
import { analyticsApi } from "@/lib/api/analytics.api";
import { showError } from "@/lib/utils/toast.util";
import { formatCurrency, formatNumber } from "@/lib/utils/format.util";
import type {
  AnalyticsOverview,
  TopPackagesResponse,
  PurchasesByCountryResponse,
} from "@/types/analytics.types";

export default function AnalyticsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
  const [topPackages, setTopPackages] = useState<TopPackagesResponse | null>(null);
  const [purchasesByCountry, setPurchasesByCountry] = useState<PurchasesByCountryResponse | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [overviewData, topPackagesData, countriesData] = await Promise.all([
          analyticsApi.overview(),
          analyticsApi.topPackages(10),
          analyticsApi.purchasesByCountry(),
        ]);
        setOverview(overviewData);
        setTopPackages(topPackagesData);
        setPurchasesByCountry(countriesData);
      } catch {
        showError("Failed to load analytics data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Analytics" description="Platform analytics and insights" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-96" />
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Analytics" description="Platform analytics and insights" />

      <div className="bg-card border rounded-lg p-6 space-y-4">
        <h2 className="text-lg font-semibold">Users</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatsCard
            title="Total"
            value={formatNumber(overview?.users?.total ?? 0)}
            icon={Users}
          />
          <StatsCard
            title="New Today"
            value={formatNumber(overview?.users?.newToday ?? 0)}
            icon={TrendingUp}
          />
          <StatsCard
            title="New This Week"
            value={formatNumber(overview?.users?.newThisWeek ?? 0)}
            icon={TrendingUp}
          />
          <StatsCard
            title="New This Month"
            value={formatNumber(overview?.users?.newThisMonth ?? 0)}
            icon={TrendingUp}
          />
        </div>
      </div>

      <div className="bg-card border rounded-lg p-6 space-y-4">
        <h2 className="text-lg font-semibold">Purchases</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <StatsCard
            title="Today"
            value={formatNumber(overview?.purchases?.today ?? 0)}
            icon={ShoppingCart}
          />
          <StatsCard
            title="This Week"
            value={formatNumber(overview?.purchases?.thisWeek ?? 0)}
            icon={ShoppingCart}
          />
          <StatsCard
            title="This Month"
            value={formatNumber(overview?.purchases?.thisMonth ?? 0)}
            icon={ShoppingCart}
          />
        </div>
      </div>

      <div className="bg-card border rounded-lg p-6 space-y-4">
        <h2 className="text-lg font-semibold">Revenue</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <StatsCard
            title="Today"
            value={formatCurrency(overview?.revenue?.today ?? 0)}
            icon={DollarSign}
          />
          <StatsCard
            title="This Week"
            value={formatCurrency(overview?.revenue?.thisWeek ?? 0)}
            icon={DollarSign}
          />
          <StatsCard
            title="This Month"
            value={formatCurrency(overview?.revenue?.thisMonth ?? 0)}
            icon={DollarSign}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Top Packages by Volume</h2>
          {!topPackages?.packages?.length ? (
            <p className="text-sm text-muted-foreground">No data available.</p>
          ) : (
            <div className="space-y-3">
              {topPackages.packages.map((pkg, index) => (
                <div
                  key={`${pkg.packageId}:${pkg.packageName}`}
                  className="flex items-center justify-between py-2 border-b last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-muted-foreground w-5">
                      {index + 1}.
                    </span>
                    <div>
                      <span className="text-sm font-medium">{pkg.packageName}</span>
                      <p className="text-xs text-muted-foreground">{pkg.packageId}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">{formatNumber(pkg.purchaseCount)} sales</p>
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
          {!purchasesByCountry?.countries?.length ? (
            <p className="text-sm text-muted-foreground">No data available.</p>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {purchasesByCountry.countries.map((item) => (
                <div
                  key={item.countryCode}
                  className="flex items-center justify-between py-2 border-b last:border-0"
                >
                  <div>
                    <span className="text-sm font-medium">{item.countryName}</span>
                    <p className="text-xs text-muted-foreground">{item.countryCode}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">{formatNumber(item.purchaseCount)}</p>
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
