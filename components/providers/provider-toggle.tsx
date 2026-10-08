"use client";

import { useState } from "react";
import { providersApi } from "@/lib/api/providers.api";
import { showSuccess, showError } from "@/lib/utils/toast.util";
import { MESSAGES } from "@/constants/messages.constants";
import type { ProviderFlags } from "@/types/config.types";

interface ProviderToggleProps {
  flags: ProviderFlags;
  onSaved: (flags: ProviderFlags) => void;
}

export function ProviderToggle({ flags, onSaved }: ProviderToggleProps) {
  const [savingKey, setSavingKey] = useState<string | null>(null);

  const providers = flags.providers ?? [];

  const handleFlagToggle = async (
    providerName: "telna" | "transatel",
    key: "catalog" | "purchase" | "statusSync",
    value: boolean
  ) => {
    if (key === "purchase" && value) {
      const otherHasPurchase = providers.some(
        (p) => p.name !== providerName && p.flags.purchase
      );
      if (otherHasPurchase) {
        showError("Only one provider can handle purchases at a time.");
        return;
      }
    }

    try {
      setSavingKey(`${providerName}.${key}`);
      const updated = await providersApi.updateFlags(providerName, {
        [key]: value,
      });
      onSaved(updated);
      showSuccess(MESSAGES.PROVIDERS.SAVE_SUCCESS);
    } catch {
      showError("Failed to update provider flags");
    } finally {
      setSavingKey(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-card border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Provider Flags</h2>

        <div className="space-y-6">
          {providers.map((provider) => (
            <div key={provider.name} className="border-b last:border-0 pb-4">
              <h3 className="font-semibold">{provider.displayName}</h3>

              <div className="mt-3 space-y-3">
                {(["catalog", "purchase", "statusSync"] as const).map((key) => (
                  <div
                    key={key}
                    className="flex items-center justify-between py-2"
                  >
                    <div>
                      <p className="text-sm font-medium">
                        {key === "catalog"
                          ? "Catalog"
                          : key === "purchase"
                            ? "Purchases"
                            : "Status Sync"}
                      </p>
                      <p className="text-xs text-muted-foreground font-mono">
                        {key}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        handleFlagToggle(provider.name, key, !provider.flags[key])
                      }
                      disabled={savingKey === `${provider.name}.${key}`}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        provider.flags[key]
                          ? "bg-primary"
                          : "bg-muted-foreground/30"
                      } disabled:opacity-50`}
                      aria-checked={provider.flags[key]}
                      role="switch"
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          provider.flags[key] ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
