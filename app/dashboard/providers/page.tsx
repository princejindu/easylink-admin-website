"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { ProviderToggle } from "@/components/providers/provider-toggle";
import { providersApi } from "@/lib/api/providers.api";
import { showError } from "@/lib/utils/toast.util";
import type { ProviderFlags } from "@/types/config.types";

export default function ProvidersPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [flags, setFlags] = useState<ProviderFlags | null>(null);

  const fetchFlags = async () => {
    try {
      const data = await providersApi.getFlags();
      setFlags(data);
    } catch {
      showError("Failed to load provider flags");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFlags();
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
        description="Switch the active eSIM provider and manage feature flags"
      />

      {flags ? (
        <ProviderToggle flags={flags} onSaved={setFlags} />
      ) : (
        <div className="bg-card border rounded-lg p-8 text-center text-muted-foreground">
          Unable to load provider flags. Refresh the page to try again.
        </div>
      )}
    </div>
  );
}
