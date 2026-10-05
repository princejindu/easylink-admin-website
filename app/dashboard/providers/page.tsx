"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { ProviderFlagsList } from "@/components/providers/provider-flags-list";
import { providersApi } from "@/lib/api/providers.api";
import { showError } from "@/lib/utils/toast.util";
import type { ProvidersResponse } from "@/types/config.types";

export default function ProvidersPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [providersData, setProvidersData] = useState<ProvidersResponse | null>(null);

  const fetchProviders = async () => {
    try {
      const data = await providersApi.getProviders();
      setProvidersData(data);
    } catch {
      showError("Failed to load provider flags");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProviders();
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
        title="Providers"
        description="Manage provider feature flags (catalog, purchase, status sync)"
      />

      {providersData ? (
        <ProviderFlagsList providersData={providersData} onSaved={setProvidersData} />
      ) : (
        <div className="bg-card border rounded-lg p-8 text-center text-muted-foreground">
          Unable to load provider flags. Refresh the page to try again.
        </div>
      )}
    </div>
  );
}
