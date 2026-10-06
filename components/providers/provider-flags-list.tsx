"use client";

import { useState } from "react";
import { providersApi } from "@/lib/api/providers.api";
import { showSuccess, showError } from "@/lib/utils/toast.util";
import type { ProvidersResponse, Provider } from "@/types/config.types";

interface ProviderFlagsListProps {
  providersData: ProvidersResponse;
  onSaved: (data: ProvidersResponse) => void;
}

export function ProviderFlagsList({ providersData, onSaved }: ProviderFlagsListProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [providers, setProviders] = useState<Provider[]>([...providersData.providers]);

  const handleToggle = async (
    providerName: string,
    flag: keyof Provider["flags"],
    value: boolean
  ) => {
    setIsLoading(true);
    try {
      if (providerName !== "telna" && providerName !== "transatel") {
        throw new Error("Invalid provider");
      }
      const updated = await providersApi.updateProviderFlags(providerName as "telna" | "transatel", {
        [flag]: value,
      });
      onSaved(updated);
      showSuccess("Provider flags updated");
    } catch (err: any) {
      showError(err?.message || "Failed to update provider flags");
      // Revert on error
      setProviders([...providersData.providers]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {providers.map((provider) => (
        <div key={provider.name} className="bg-card border rounded-lg p-6 space-y-4">
          <div>
            <h2 className="text-lg font-semibold">{provider.displayName}</h2>
            <p className="text-sm text-muted-foreground">Provider: {provider.name}</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Catalog</p>
                <p className="text-xs text-muted-foreground">
                  Control whether this provider's packages appear in the app
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={provider.flags.catalog}
                  disabled={isLoading}
                  onChange={(e) => {
                    const updatedProviders = providers.map((p) =>
                      p.name === provider.name
                        ? { ...p, flags: { ...p.flags, catalog: e.target.checked } }
                        : p
                    );
                    setProviders(updatedProviders);
                    handleToggle(provider.name, "catalog", e.target.checked);
                  }}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-muted rounded-full peer peer-checked:bg-primary after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Purchase</p>
                <p className="text-xs text-muted-foreground">
                  Control whether new purchases go through this provider
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={provider.flags.purchase}
                  disabled={isLoading}
                  onChange={(e) => {
                    const updatedProviders = providers.map((p) =>
                      p.name === provider.name
                        ? { ...p, flags: { ...p.flags, purchase: e.target.checked } }
                        : p
                    );
                    setProviders(updatedProviders);
                    handleToggle(provider.name, "purchase", e.target.checked);
                  }}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-muted rounded-full peer peer-checked:bg-primary after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Status Sync</p>
                <p className="text-xs text-muted-foreground">
                  Control whether order status is synced from this provider
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={provider.flags.statusSync}
                  disabled={isLoading}
                  onChange={(e) => {
                    const updatedProviders = providers.map((p) =>
                      p.name === provider.name
                        ? { ...p, flags: { ...p.flags, statusSync: e.target.checked } }
                        : p
                    );
                    setProviders(updatedProviders);
                    handleToggle(provider.name, "statusSync", e.target.checked);
                  }}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-muted rounded-full peer peer-checked:bg-primary after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
              </label>
            </div>
          </div>

          <p className="text-xs text-muted-foreground bg-muted p-2 rounded">
            Note: Only one provider should have purchase enabled at a time.
          </p>
        </div>
      ))}
    </div>
  );
}
