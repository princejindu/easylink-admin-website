"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { EsimPricingForm } from "@/components/config/esim-pricing-form";
import { FeaturedPackagesManager } from "@/components/config/featured-packages-manager";
import { PopularPackagesManager } from "@/components/config/popular-packages-manager";
import { CacheManager } from "@/components/config/cache-manager";
import { esimConfigApi } from "@/lib/api/esim-config.api";
import { showError } from "@/lib/utils/toast.util";
import type { EsimPricingConfig, FeaturedPackages, PopularPackages } from "@/types/config.types";

export default function ConfigPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [pricing, setPricing] = useState<EsimPricingConfig | null>(null);
  const [featured, setFeatured] = useState<FeaturedPackages | null>(null);
  const [popular, setPopular] = useState<PopularPackages | null>(null);

  const fetchData = async () => {
    try {
      const [pricingData, featuredData, popularData] = await Promise.all([
        esimConfigApi.getPricing(),
        esimConfigApi.getFeaturedPackages(),
        esimConfigApi.getPopularPackages(),
      ]);
      setPricing(pricingData);
      setFeatured(featuredData);
      setPopular(popularData);
    } catch {
      showError("Failed to load system configuration");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="System Config"
        description="Configure eSIM pricing, featured packages, and popular packages"
      />

      {pricing && (
        <EsimPricingForm pricing={pricing} onSaved={setPricing} />
      )}

      {featured && (
        <FeaturedPackagesManager featured={featured} onSaved={setFeatured} />
      )}

      {popular && (
        <PopularPackagesManager popular={popular} onSaved={setPopular} />
      )}

      <CacheManager />
    </div>
  );
}
