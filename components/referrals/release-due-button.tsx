"use client";

import { useState } from "react";
import { Unlock } from "lucide-react";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { referralsApi } from "@/lib/api/referrals.api";
import { showError, showInfo, showSuccess } from "@/lib/utils/toast.util";
import { getErrorMessage } from "@/lib/utils/error.util";
import { formatMoney } from "@/lib/utils/format.util";

interface ReleaseDueButtonProps {
  onReleased: () => void;
}

export function ReleaseDueButton({ onReleased }: ReleaseDueButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  const handleRelease = async () => {
    setIsRunning(true);
    try {
      const result = await referralsApi.releaseDue();
      if (!result) return;
      const released = Number(result.released ?? 0);
      if (released === 0) {
        showInfo("No rewards were due. Nothing was released.");
      } else {
        showSuccess(
          `Released ${released} ${released === 1 ? "reward" : "rewards"}, ${formatMoney(result.amount, "GBP", "amount unknown")} in total.`
        );
      }
      setIsOpen(false);
      onReleased();
    } catch (error) {
      showError(getErrorMessage(error, "Failed to release rewards"));
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-input text-sm font-medium hover:bg-accent transition-colors"
      >
        <Unlock className="w-4 h-4" />
        Release due rewards now
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="release-due-title"
            className="bg-card border rounded-lg p-6 w-full max-w-md space-y-4 shadow-xl"
          >
            <h2 id="release-due-title" className="text-lg font-semibold">
              Release due rewards
            </h2>
            <p className="text-sm text-muted-foreground">
              This moves every pending reward whose release date has passed to Available, oldest
              first. It runs on a schedule anyway. Use this only if you do not want to wait.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setIsOpen(false)}
                disabled={isRunning}
                className="px-4 py-2 rounded-lg border border-input text-sm hover:bg-accent transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleRelease}
                disabled={isRunning}
                className="px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-white text-sm font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isRunning && <LoadingSpinner size="sm" />}
                Release now
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
