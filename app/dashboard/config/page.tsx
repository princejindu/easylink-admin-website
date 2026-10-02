"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { ConfigForm } from "@/components/config/config-form";
import { configApi } from "@/lib/api/config.api";
import { showError } from "@/lib/utils/toast.util";
import type { SystemConfig } from "@/types/config.types";

export default function ConfigPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [config, setConfig] = useState<SystemConfig | null>(null);

  const fetchConfig = async () => {
    try {
      const data = await configApi.get();
      setConfig(data);
    } catch {
      showError("Failed to load system configuration");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
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
        description="Configure pricing, discounts, referral commissions, and featured packages"
      />

      {config ? (
        <ConfigForm config={config} onSaved={setConfig} />
      ) : (
        <div className="bg-card border rounded-lg p-8 text-center text-muted-foreground">
          Unable to load configuration. Refresh the page to try again.
        </div>
      )}
    </div>
  );
}
