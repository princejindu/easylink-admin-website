"use client";

import { useState } from "react";
import { Star, StarOff } from "lucide-react";
import { packagesApi } from "@/lib/api/packages.api";
import { showSuccess, showError } from "@/lib/utils/toast.util";
import { MESSAGES } from "@/constants/messages.constants";
import type { EsimPackage } from "@/types/package.types";

interface PackageTableProps {
  packages: EsimPackage[];
  onRefresh: () => void;
}

export function PackageTable({ packages, onRefresh }: PackageTableProps) {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleToggleFeature = async (pkg: EsimPackage) => {
    setLoadingId(pkg.id);
    try {
      if (pkg.isFeatured) {
        await packagesApi.unfeature(pkg.id);
        showSuccess(MESSAGES.PACKAGES.UNFEATURE_SUCCESS);
      } else {
        await packagesApi.feature(pkg.id);
        showSuccess(MESSAGES.PACKAGES.FEATURE_SUCCESS);
      }
      onRefresh();
    } catch {
      showError("Failed to update package");
    } finally {
      setLoadingId(null);
    }
  };

  if (!packages.length) {
    return (
      <div className="bg-card border rounded-lg p-12 text-center text-muted-foreground">
        No packages found.
      </div>
    );
  }

  return (
    <div className="bg-card border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                Name
              </th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">
                Data
              </th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden sm:table-cell">
                Validity
              </th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                Price
              </th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden lg:table-cell">
                Provider
              </th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                Featured
              </th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {packages.map((pkg) => (
              <tr
                key={pkg.id}
                className="border-b last:border-0 hover:bg-accent/50 transition-colors"
              >
                <td className="px-4 py-3 font-medium">{pkg.name}</td>
                <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                  {pkg.dataGb} GB
                </td>
                <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">
                  {pkg.validityDays} days
                </td>
                <td className="px-4 py-3 font-medium">
                  &pound;{pkg.priceGbp.toFixed(2)}
                </td>
                <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell capitalize">
                  {pkg.provider ?? "—"}
                </td>
                <td className="px-4 py-3">
                  {pkg.isFeatured ? (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-yellow-600 dark:text-yellow-400">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      Featured
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground">No</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleToggleFeature(pkg)}
                    disabled={loadingId === pkg.id}
                    className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border border-input hover:bg-accent transition-colors disabled:opacity-50"
                  >
                    {loadingId === pkg.id ? (
                      "..."
                    ) : pkg.isFeatured ? (
                      <>
                        <StarOff className="w-3.5 h-3.5" />
                        Unfeature
                      </>
                    ) : (
                      <>
                        <Star className="w-3.5 h-3.5" />
                        Feature
                      </>
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
