"use client";

import { useState, useEffect } from "react";
import { referralsApi } from "@/lib/api/referrals.api";
import { showSuccess, showError } from "@/lib/utils/toast.util";
import { getErrorMessage } from "@/lib/utils/error.util";

const MIN_PERCENT = 0;
const MAX_PERCENT = 50;
const STEP = 0.5;

interface CommissionRateCardProps {
  commissionPercent: number;
  onUpdated: (commissionPercent: number) => void;
}

function validatePercent(raw: string): string | null {
  if (raw.trim() === "") return "Enter a rate";
  const num = Number(raw);
  if (Number.isNaN(num)) return "Enter a number";
  if (num < MIN_PERCENT || num > MAX_PERCENT) {
    return `Rate must be between ${MIN_PERCENT} and ${MAX_PERCENT}`;
  }
  if (!Number.isInteger(num / STEP)) {
    return `Rate must be in steps of ${STEP}`;
  }
  return null;
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

  const validationError = validatePercent(value);
  const isUnchanged = !validationError && Number(value) === commissionPercent;

  const handleSave = async () => {
    if (validationError) {
      showError(validationError);
      return;
    }

    const num = Number(value);
    const confirmed = window.confirm(
      `Change the commission rate from ${commissionPercent}% to ${num}%?${num === 0 ? " This turns referral commissions off." : ""}\n\nApplies to new purchases only.`
    );
    if (!confirmed) return;

    setIsSaving(true);
    try {
      const updated = await referralsApi.updateCommissionRate(num);
      if (!updated) return;
      onUpdated(updated.commissionPercent);
      showSuccess(`Commission rate set to ${updated.commissionPercent}%`);
    } catch (error) {
      showError(getErrorMessage(error, "Failed to update commission rate"));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section
      aria-labelledby="commission-rate-heading"
      className="bg-card border rounded-lg p-6 space-y-4"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 id="commission-rate-heading" className="text-lg font-semibold">
            Commission Rate
          </h2>
          <p className="text-sm text-muted-foreground">
            Share of each eSIM purchase paid into the referrer&apos;s wallet.
          </p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-semibold tabular-nums">
            {commissionPercent === 0 ? "Off" : `${commissionPercent}%`}
          </div>
          <div className="text-xs text-muted-foreground">Current rate</div>
        </div>
      </div>

      <form
        className="flex flex-wrap items-start gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          handleSave();
        }}
      >
        <div className="space-y-1">
          <label htmlFor="commission-percent" className="sr-only">
            New commission percent
          </label>
          <div className="relative">
            <input
              id="commission-percent"
              type="number"
              inputMode="decimal"
              min={MIN_PERCENT}
              max={MAX_PERCENT}
              step={STEP}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              aria-invalid={Boolean(validationError)}
              aria-describedby="commission-percent-help"
              className="w-32 pl-4 pr-8 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary aria-[invalid=true]:border-red-500"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
              %
            </span>
          </div>
          {validationError && (
            <p className="text-xs text-red-600 dark:text-red-400">
              {validationError}
            </p>
          )}
        </div>
        <button
          type="submit"
          disabled={isSaving || Boolean(validationError) || isUnchanged}
          className="bg-primary hover:bg-primary/90 text-white font-medium py-2 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? "Saving..." : "Save"}
        </button>
      </form>

      <div id="commission-percent-help" className="space-y-0.5">
        <p className="text-sm font-medium">Applies to new purchases only.</p>
        <p className="text-xs text-muted-foreground">
          {MIN_PERCENT} to {MAX_PERCENT}, in steps of {STEP}.
        </p>
      </div>
    </section>
  );
}
