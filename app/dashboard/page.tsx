"use client";

import { useState, useEffect } from "react";
import { Users, ShoppingCart, TrendingUp, DollarSign } from "lucide-react";
import { StatsCard } from "@/components/shared/stats-card";
import { PageHeader } from "@/components/shared/page-header";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { analyticsApi } from "@/lib/api/analytics.api";
import { showError } from "@/lib/utils/toast.util";
import { formatCurrency, formatNumber } from "@/lib/utils/format.util";
import type { AnalyticsOverview, TopPackage, PurchaseByCountry } from "@/types/analytics.types";

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
  const [topPackages, setTopPackages] = useState<TopPackage[]>([]);
  const [purchasesByCountry, setPurchasesByCountry] = useState<PurchaseByCountry[]>([]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [overviewData, packagesData, countriesData] = await Promise.all([
          analyticsApi.overview(),
          analyticsApi.topPackages(10),
          analyticsApi.purchasesByCountry(),
        ]);
        setOverview(overviewData);
        setTopPackages(packagesData.packages);
        setPurchasesByCountry(countriesData.countries);
      } catch {
        showError("Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAll();
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
          {topPackages.length === 0 ? (
            <p className="text-sm text-muted-foreground">No data available.</p>
          ) : (
            <div className="space-y-3">
              {topPackages.map((pkg, index) => (
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
          {purchasesByCountry.length === 0 ? (
            <p className="text-sm text-muted-foreground">No data available.</p>
          ) : (
            <div className="space-y-3">
              {purchasesByCountry.slice(0, 8).map((item) => (
                <div
                  key={item.countryCode}
                  className="flex items-center justify-between py-2 border-b last:border-0"
                >
                  <span className="text-sm font-medium">{item.countryName}</span>
                  <p className="text-sm font-semibold">{formatNumber(item.purchaseCount)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
