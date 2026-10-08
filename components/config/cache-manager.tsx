"use client";

import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { esimConfigApi } from "@/lib/api/esim-config.api";
import { showSuccess, showError } from "@/lib/utils/toast.util";

export function CacheManager() {
  const [isLoading, setIsLoading] = useState(false);

  const handleClearCache = async () => {
    setIsLoading(true);
    try {
      await esimConfigApi.clearCache();
      showSuccess("Cache cleared successfully");
    } catch {
      showError("Failed to clear cache");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-card border rounded-lg p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">eSIM Cache</h2>
          <p className="text-sm text-muted-foreground">
            Clear Redis cache to force fresh data fetch from providers.
          </p>
        </div>
        <button
          onClick={handleClearCache}
          disabled={isLoading}
          className="flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-medium py-2 px-4 rounded-lg text-sm transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          {isLoading ? "Clearing..." : "Clear Cache"}
        </button>
      </div>
    </div>
  );
}
