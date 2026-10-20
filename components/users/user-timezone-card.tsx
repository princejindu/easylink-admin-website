"use client";

import { Clock4 } from "lucide-react";
import type { User } from "@/types/user.types";

function modeLabel(mode?: string | null): string {
  const value = (mode ?? "").toUpperCase();
  if (value === "CUSTOM") return "Custom";
  if (value === "DEVICE") return "Device";
  return mode || "Not set";
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2 justify-between">
      <span className="text-muted-foreground shrink-0">{label}</span>
      <span className="text-right">{children}</span>
    </div>
  );
}

export function UserTimezoneCard({ user }: { user: User }) {
  const hasAny =
    user.timezoneMode || user.timezone || user.deviceTimezone || user.effectiveTimezone;
  if (!hasAny) return null;

  const isCustom = (user.timezoneMode ?? "").toUpperCase() === "CUSTOM";

  return (
    <div className="bg-card border rounded-lg p-6 space-y-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
        <Clock4 className="w-4 h-4" />
        Time zone
      </div>
      <div className="space-y-3 text-sm">
        <Row label="Mode">{modeLabel(user.timezoneMode)}</Row>
        <Row label="Zone used">{user.effectiveTimezone || "Not set"}</Row>
        <Row label="Device zone">{user.deviceTimezone || "Not reported"}</Row>
        {isCustom && <Row label="Custom zone">{user.timezone || "Not set"}</Row>}
      </div>
    </div>
  );
}
