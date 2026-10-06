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

const PROVIDER_OPTIONS = [
  { value: "transatel", label: "Transatel", description: "Default provider" },
  { value: "telna", label: "Telna", description: "Fallback provider" },
] as const;

export function ProviderToggle({ flags, onSaved }: ProviderToggleProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [localFlags, setLocalFlags] = useState<ProviderFlags>({ ...flags });

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updated = await providersApi.updateFlags(localFlags);
      onSaved(updated);
      showSuccess(MESSAGES.PROVIDERS.SAVE_SUCCESS);
    } catch {
      showError("Failed to update provider flags");
    } finally {
      setIsSaving(false);
    }
  };

  const handleFlagToggle = (key: string, value: boolean) => {
    setLocalFlags((prev) => ({
      ...prev,
      flags: { ...prev.flags, [key]: value },
    }));
  };

  return (
    <div className="space-y-6">
      <div className="bg-card border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Active Provider</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {PROVIDER_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() =>
                setLocalFlags({ ...localFlags, activeProvider: option.value })
              }
              className={`p-4 rounded-lg border-2 text-left transition-colors ${
                localFlags.activeProvider === option.value
                  ? "border-primary bg-primary/5"
                  : "border-input hover:border-primary/30"
              }`}
            >
              <p className="font-semibold">{option.label}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {option.description}
              </p>
              {localFlags.activeProvider === option.value && (
                <span className="inline-block mt-2 text-xs font-medium text-primary">
                  Currently active
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {localFlags.flags && Object.keys(localFlags.flags).length > 0 && (
        <div className="bg-card border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Feature Flags</h2>
          <div className="space-y-3">
            {(localFlags.flags ? Object.entries(localFlags.flags) : []).map(([key, value]) => (
              <div
                key={key}
                className="flex items-center justify-between py-2 border-b last:border-0"
              >
                <div>
                  <p className="text-sm font-medium capitalize">
                    {key.replace(/_/g, " ")}
                  </p>
                  <p className="text-xs text-muted-foreground font-mono">{key}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleFlagToggle(key, !value)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    value ? "bg-primary" : "bg-muted-foreground/30"
                  }`}
                  aria-checked={value}
                  role="switch"
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      value ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={handleSave}
        disabled={isSaving}
        className="bg-primary hover:bg-primary/90 text-white font-medium py-2.5 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSaving ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
}
