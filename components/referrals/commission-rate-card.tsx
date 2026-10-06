"use client";

import { useState, useEffect } from "react";
import { referralsApi } from "@/lib/api/referrals.api";
import { showSuccess, showError } from "@/lib/utils/toast.util";
import { getErrorMessage } from "@/lib/utils/error.util";

interface CommissionRateCardProps {
  commissionPercent: number;
  onUpdated: (commissionPercent: number) => void;
}

export function CommissionRateCard({
  commissionPercent,
  onUpdated,
}: CommissionRateCardProps) {
  const [value, setValue] = useState<string>(String(commissionPercent));
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setValue(String(commissionPercent));
  }, [commissionPercent]);

  const handleSave = async () => {
    const num = parseFloat(value);

    if (Number.isNaN(num) || num < 0 || num > 100) {
      showError("Commission rate must be between 0 and 100");
      return;
    }

    const change = Math.abs(num - commissionPercent);
    const largeChange =
      change >= 5 && (num === 0 || commissionPercent === 0 || change > 10);

    if (largeChange) {
      const confirmed = window.confirm(
        `You are changing the commission rate from ${commissionPercent}% to ${num}%.${num === 0 ? " This will disable referrals going forward." : ""} Continue?`
      );
      if (!confirmed) return;
    }

    setIsSaving(true);
    try {
      const updated = await referralsApi.updateCommissionRate(num);
      onUpdated(updated.commissionPercent);
      showSuccess("Commission rate updated");
    } catch (error) {
      showError(getErrorMessage(error, "Failed to update commission rate"));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-card border rounded-lg p-6 space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Commission Rate</h2>
        <p className="text-sm text-muted-foreground">
          Percentage of each eSIM purchase credited to the referrer.
        </p>
      </div>

      <p className="text-sm">
        Current rate:{" "}
        <span className="font-semibold">
          {commissionPercent === 0 ? "Disabled" : `${commissionPercent}%`}
        </span>
      </p>

      <div className="flex items-center gap-3">
        <input
          type="number"
          min="0"
          max="100"
          step="0.1"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-32 px-4 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-primary hover:bg-primary/90 text-white font-medium py-2 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
}