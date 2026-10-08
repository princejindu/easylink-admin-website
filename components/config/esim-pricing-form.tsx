"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { esimConfigApi } from "@/lib/api/esim-config.api";
import { showSuccess, showError } from "@/lib/utils/toast.util";
import type { EsimPricingConfig, PricingOverride } from "@/types/config.types";

interface EsimPricingFormProps {
  pricing: EsimPricingConfig;
  onSaved: (pricing: EsimPricingConfig) => void;
}

const REGIONS = ["Africa", "Europe", "Asia", "Americas", "Middle East", "Oceania"];

export function EsimPricingForm({ pricing, onSaved }: EsimPricingFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [globalForm, setGlobalForm] = useState<PricingOverride>({ ...pricing.global });
  const [newRegion, setNewRegion] = useState({ region: "", markupPercent: 0, discountPercent: 0 });
  const [newPackage, setNewPackage] = useState({ packageId: "", markupPercent: 0, discountPercent: 0 });

  const handleUpdateGlobal = async () => {
    setIsLoading(true);
    try {
      const updated = await esimConfigApi.updateGlobalPricing(globalForm);
      onSaved(updated);
      showSuccess("Global pricing updated");
    } catch {
      showError("Failed to update global pricing");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddRegion = async () => {
    if (!newRegion.region) return;
    setIsLoading(true);
    try {
      const updated = await esimConfigApi.setRegionPricing(newRegion.region, {
        markupPercent: newRegion.markupPercent,
        discountPercent: newRegion.discountPercent,
      });
      onSaved(updated);
      setNewRegion({ region: "", markupPercent: 0, discountPercent: 0 });
      showSuccess("Region override added");
    } catch {
      showError("Failed to add region override");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteRegion = async (region: string) => {
    if (!confirm(`Remove pricing override for ${region}?`)) return;
    setIsLoading(true);
    try {
      const updated = await esimConfigApi.deleteRegionPricing(region);
      onSaved(updated);
      showSuccess("Region override removed");
    } catch {
      showError("Failed to remove region override");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddPackage = async () => {
    if (!newPackage.packageId) return;
    setIsLoading(true);
    try {
      const updated = await esimConfigApi.setPackagePricing(newPackage.packageId, {
        markupPercent: newPackage.markupPercent,
        discountPercent: newPackage.discountPercent,
      });
      onSaved(updated);
      setNewPackage({ packageId: "", markupPercent: 0, discountPercent: 0 });
      showSuccess("Package override added");
    } catch {
      showError("Failed to add package override");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePackage = async (packageId: string) => {
    if (!confirm(`Remove pricing override for ${packageId}?`)) return;
    setIsLoading(true);
    try {
      const updated = await esimConfigApi.deletePackagePricing(packageId);
      onSaved(updated);
      showSuccess("Package override removed");
    } catch {
      showError("Failed to remove package override");
    } finally {
      setIsLoading(false);
    }
  };

  const regions = Object.entries(pricing.regions || {});
  const packages = Object.entries(pricing.packages || {});

  return (
    <div className="space-y-6">
      <div className="bg-card border rounded-lg p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Global Pricing</h2>
          <button
            onClick={handleUpdateGlobal}
            disabled={isLoading}
            className="bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded-lg text-sm transition-colors disabled:opacity-50"
          >
            Save Global
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Markup (%)</label>
            <input
              type="number"
              min="0"
              max="1000"
              step="0.1"
              value={globalForm.markupPercent}
              onChange={(e) =>
                setGlobalForm({ ...globalForm, markupPercent: parseFloat(e.target.value) || 0 })
              }
              className="w-full px-4 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <p className="text-xs text-muted-foreground">
              Markup is applied first: price × (1 + markup%)
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Discount (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={globalForm.discountPercent}
              onChange={(e) =>
                setGlobalForm({ ...globalForm, discountPercent: parseFloat(e.target.value) || 0 })
              }
              className="w-full px-4 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <p className="text-xs text-muted-foreground">
              Discount applied after markup: (marked-up) × (1 - discount%)
            </p>
          </div>
        </div>

        <div className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
          Example: £10 provider × 1.20 (20% markup) × 0.95 (5% discount) = £11.40
        </div>
      </div>

      <div className="bg-card border rounded-lg p-6 space-y-4">
        <h2 className="text-lg font-semibold">Region Overrides</h2>

        {regions.length === 0 ? (
          <p className="text-sm text-muted-foreground">No region overrides configured.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2 font-medium">Region</th>
                  <th className="text-left p-2 font-medium">Markup %</th>
                  <th className="text-left p-2 font-medium">Discount %</th>
                  <th className="text-right p-2 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {regions.map(([region, override]) => (
                  <tr key={region} className="border-b last:border-0">
                    <td className="p-2 font-medium">{region}</td>
                    <td className="p-2">{override.markupPercent}%</td>
                    <td className="p-2">{override.discountPercent}%</td>
                    <td className="p-2 text-right">
                      <button
                        onClick={() => handleDeleteRegion(region)}
                        disabled={isLoading}
                        className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="border-t pt-4 space-y-3">
          <h3 className="text-sm font-medium">Add Region Override</h3>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <select
              value={newRegion.region}
              onChange={(e) => setNewRegion({ ...newRegion, region: e.target.value })}
              className="px-4 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary flex-1"
            >
              <option value="">Select region...</option>
              {REGIONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
            <input
              type="number"
              min="0"
              max="1000"
              step="0.1"
              placeholder="Markup %"
              value={newRegion.markupPercent}
              onChange={(e) =>
                setNewRegion({ ...newRegion, markupPercent: parseFloat(e.target.value) || 0 })
              }
              className="w-full sm:w-28 px-4 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="number"
              min="0"
              max="100"
              step="0.1"
              placeholder="Discount %"
              value={newRegion.discountPercent}
              onChange={(e) =>
                setNewRegion({ ...newRegion, discountPercent: parseFloat(e.target.value) || 0 })
              }
              className="w-full sm:w-28 px-4 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              onClick={handleAddRegion}
              disabled={isLoading || !newRegion.region}
              className="flex items-center gap-2 bg-secondary 
              hover:bg-secondary/80 text-secondary-foreground font-medium py-2 px-4 rounded-lg text-sm transition-colors disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          </div>
        </div>
      </div>

      <div className="bg-card border rounded-lg p-6 space-y-4">
        <h2 className="text-lg font-semibold">Package Overrides</h2>

        {packages.length === 0 ? (
          <p className="text-sm text-muted-foreground">No package overrides configured.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2 font-medium">Package ID</th>
                  <th className="text-left p-2 font-medium">Markup %</th>
                  <th className="text-left p-2 font-medium">Discount %</th>
                  <th className="text-right p-2 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {packages.map(([packageId, override]) => (
                  <tr key={packageId} className="border-b last:border-0">
                    <td className="p-2 font-medium truncate max-w-xs">{packageId}</td>
                    <td className="p-2">{override.markupPercent}%</td>
                    <td className="p-2">{override.discountPercent}%</td>
                    <td className="p-2 text-right">
                      <button
                        onClick={() => handleDeletePackage(packageId)}
                        disabled={isLoading}
                        className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="border-t pt-4 space-y-3">
          <h3 className="text-sm font-medium">Add Package Override</h3>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <input
              type="text"
              placeholder="Package ID"
              value={newPackage.packageId}
              onChange={(e) => setNewPackage({ ...newPackage, packageId: e.target.value })}
              className="px-4 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary flex-1"
            />
            <input
              type="number"
              min="0"
              max="1000"
              step="0.1"
              placeholder="Markup %"
              value={newPackage.markupPercent}
              onChange={(e) =>
                setNewPackage({ ...newPackage, markupPercent: parseFloat(e.target.value) || 0 })
              }
              className="w-full sm:w-28 px-4 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="number"
              min="0"
              max="100"
              step="0.1"
              placeholder="Discount %"
              value={newPackage.discountPercent}
              onChange={(e) =>
                setNewPackage({ ...newPackage, discountPercent: parseFloat(e.target.value) || 0 })
              }
              className="w-full sm:w-28 px-4 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              onClick={handleAddPackage}
              disabled={isLoading || !newPackage.packageId}
              className="flex items-center gap-2 bg-secondary 
              hover:bg-secondary/80 text-secondary-foreground font-medium py-2 px-4 rounded-lg text-sm transition-colors disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
