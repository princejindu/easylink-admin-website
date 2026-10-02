"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { configApi } from "@/lib/api/config.api";
import { showSuccess, showError } from "@/lib/utils/toast.util";
import { MESSAGES } from "@/constants/messages.constants";
import type { SystemConfig } from "@/types/config.types";

interface ConfigFormProps {
  config: SystemConfig;
  onSaved: (config: SystemConfig) => void;
}

export function ConfigForm({ config, onSaved }: ConfigFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState<SystemConfig>({ ...config });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const updated = await configApi.update(form);
      onSaved(updated);
      showSuccess(MESSAGES.CONFIG.SAVE_SUCCESS);
    } catch {
      showError("Failed to save configuration");
    } finally {
      setIsLoading(false);
    }
  };

  const addRegionOverride = () => {
    setForm((prev) => ({
      ...prev,
      regionPricingOverrides: [
        ...prev.regionPricingOverrides,
        { region: "", markupPercent: 0 },
      ],
    }));
  };

  const removeRegionOverride = (index: number) => {
    setForm((prev) => ({
      ...prev,
      regionPricingOverrides: prev.regionPricingOverrides.filter(
        (_, i) => i !== index
      ),
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-card border rounded-lg p-6 space-y-4">
        <h2 className="text-lg font-semibold">Global Pricing</h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Global Markup (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={form.globalMarkupPercent}
              onChange={(e) =>
                setForm({ ...form, globalMarkupPercent: parseFloat(e.target.value) || 0 })
              }
              className="w-full px-4 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Global Discount (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={form.globalDiscountPercent}
              onChange={(e) =>
                setForm({ ...form, globalDiscountPercent: parseFloat(e.target.value) || 0 })
              }
              className="w-full px-4 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Referral Commission (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={form.referralCommissionPercent}
              onChange={(e) =>
                setForm({ ...form, referralCommissionPercent: parseFloat(e.target.value) || 0 })
              }
              className="w-full px-4 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      </div>

      <div className="bg-card border rounded-lg p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Region Pricing Overrides</h2>
          <button
            type="button"
            onClick={addRegionOverride}
            className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Region
          </button>
        </div>

        {!form.regionPricingOverrides.length ? (
          <p className="text-sm text-muted-foreground">
            No region overrides configured.
          </p>
        ) : (
          <div className="space-y-3">
            {form.regionPricingOverrides.map((override, index) => (
              <div key={index} className="flex items-center gap-3">
                <input
                  type="text"
                  placeholder="Region (e.g. US, EU)"
                  value={override.region}
                  onChange={(e) => {
                    const updated = [...form.regionPricingOverrides];
                    updated[index] = { ...updated[index], region: e.target.value };
                    setForm({ ...form, regionPricingOverrides: updated });
                  }}
                  className="flex-1 px-4 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <input
                  type="number"
                  min="0"
                  max="200"
                  step="0.1"
                  placeholder="Markup %"
                  value={override.markupPercent}
                  onChange={(e) => {
                    const updated = [...form.regionPricingOverrides];
                    updated[index] = {
                      ...updated[index],
                      markupPercent: parseFloat(e.target.value) || 0,
                    };
                    setForm({ ...form, regionPricingOverrides: updated });
                  }}
                  className="w-28 px-4 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  type="button"
                  onClick={() => removeRegionOverride(index)}
                  className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="bg-primary hover:bg-primary/90 text-white font-medium py-2.5 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Saving..." : "Save Configuration"}
      </button>
    </form>
  );
}
