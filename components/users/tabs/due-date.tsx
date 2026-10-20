"use client";

import { daysUntil, formatDateTime12, formatDaysAway } from "@/lib/utils/format.util";
import { toStatusKind } from "@/components/referrals/referral-status";

interface DueDateProps {
  status?: string | null;
  availableAt?: string | null;
  daysUntilAvailable?: number | null;
  releasedAt?: string | null;
}

/** Release date, with "in N days" while the reward is still pending. */
export function DueDate({ status, availableAt, daysUntilAvailable, releasedAt }: DueDateProps) {
  const kind = toStatusKind(status);
  if (kind === "available" && releasedAt) {
    return <span className="text-muted-foreground">Released {formatDateTime12(releasedAt)}</span>;
  }
  if (!availableAt) return <span className="text-muted-foreground">N/A</span>;
  const away = kind === "pending" ? formatDaysAway(daysUntilAvailable ?? daysUntil(availableAt)) : null;
  return (
    <div className="whitespace-nowrap">
      <div>{formatDateTime12(availableAt)}</div>
      {away && <div className="text-xs text-yellow-700 dark:text-yellow-400">{away}</div>}
    </div>
  );
}
