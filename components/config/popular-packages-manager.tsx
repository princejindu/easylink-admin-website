"use client";

import { useState } from "react";
import { Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { esimConfigApi } from "@/lib/api/esim-config.api";
import { showSuccess, showError } from "@/lib/utils/toast.util";
import type { PopularPackages } from "@/types/config.types";

interface PopularPackagesManagerProps {
  popular: PopularPackages;
  onSaved: (popular: PopularPackages) => void;
}

export function PopularPackagesManager({ popular, onSaved }: PopularPackagesManagerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [packageIds, setPackageIds] = useState<string[]>([...popular.packageIds]);
  const [newPackageId, setNewPackageId] = useState("");

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const updated = await esimConfigApi.setPopularPackages(packageIds);
      onSaved(updated);
      showSuccess("Popular packages updated");
    } catch {
      showError("Failed to update popular packages");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = () => {
    if (!newPackageId.trim()) return;
    if (packageIds.includes(newPackageId.trim())) {
      setNewPackageId("");
      return;
    }
    setPackageIds([...packageIds, newPackageId.trim()]);
    setNewPackageId("");
  };

  const handleRemove = (index: number) => {
    setPackageIds(packageIds.filter((_, i) => i !== index));
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newList = [...packageIds];
    [newList[index - 1], newList[index]] = [newList[index], newList[index - 1]];
    setPackageIds(newList);
  };

  const handleMoveDown = (index: number) => {
    if (index === packageIds.length - 1) return;
    const newList = [...packageIds];
    [newList[index + 1], newList[index]] = [newList[index], newList[index + 1]];
    setPackageIds(newList);
  };

  return (
    <div className="bg-card border rounded-lg p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Popular Packages</h2>
          <p className="text-sm text-muted-foreground">
            Packages shown in the popular section of the mobile app. Order matters.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={isLoading}
          className="bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded-lg text-sm transition-colors disabled:opacity-50"
        >
          Save
        </button>
      </div>

      {packageIds.length === 0 ? (
        <p className="text-sm text-muted-foreground">No popular packages configured.</p>
      ) : (
        <div className="space-y-2">
          {packageIds.map((id, index) => (
            <div key={index} className="flex items-center gap-2 p-3 border rounded-lg">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleMoveUp(index)}
                  disabled={index === 0}
                  className="p-1 hover:bg-muted rounded disabled:opacity-30"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleMoveDown(index)}
                  disabled={index === packageIds.length - 1}
                  className="p-1 hover:bg-muted rounded disabled:opacity-30"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
              </div>
              <span className="text-sm font-medium text-muted-foreground w-6">{index + 1}</span>
              <span className="text-sm flex-1">{id}</span>
              <button
                onClick={() => handleRemove(index)}
                className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Enter package ID"
          value={newPackageId}
          onChange={(e) => setNewPackageId(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          className="flex-1 px-4 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button
          onClick={handleAdd}
          className="bg-secondary hover:bg-secondary/80 text-secondary-foreground font-medium py-2 px-4 rounded-lg text-sm transition-colors"
        >
          Add
        </button>
      </div>
    </div>
  );
}
