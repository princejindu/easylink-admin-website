"use client";

import { CalendarClock } from "lucide-react";
import { ValidityBadge, formatReminders } from "@/components/purchases/purchase-badges";
import { formatBytes, formatDateTime12 } from "@/lib/utils/format.util";
import type { PurchaseValidity } from "@/types/purchase.types";

interface ValidityCardProps {
  validity?: Partial<PurchaseValidity> | null;
}

function DataUsage({ used, total }: { used?: number | null; total?: number | null }) {
  const hasUsed = typeof used === "number";
  const hasTotal = typeof total === "number" && total > 0;
  if (!hasUsed && !hasTotal) return <span>N/A</span>;
  if (!hasTotal) return <span>{formatBytes(used)} used</span>;

  const percent = Math.min(100, Math.max(0, ((used ?? 0) / (total as number)) * 100));
  return (
    <span className="inline-flex flex-col items-end gap-1 w-48 max-w-full">
      <span>
        {formatBytes(used ?? 0)} of {formatBytes(total)}
      </span>
      <span
        className="block h-2 w-full rounded-full bg-muted overflow-hidden"
        role="progressbar"
        aria-valuenow={Math.round(percent)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Data used"
      >
        <span
          className={`block h-full rounded-full ${percent >= 90 ? "bg-red-500" : "bg-primary"}`}
          style={{ width: `${percent}%` }}
        />
      </span>
    </span>
  );
}

export function ValidityCard({ validity }: ValidityCardProps) {
  if (!validity) return null;

  return (
    <div className="bg-card border rounded-lg p-6 space-y-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
        <CalendarClock className="w-4 h-4" />
        Validity
      </div>
      <div className="space-y-3 text-sm">
        <Row label="State">
          {validity.state ? <ValidityBadge state={validity.state} /> : "Unknown"}
        </Row>
        {validity.label && <Row label="Summary">{validity.label}</Row>}
        <Row label="Start by">{formatDateTime12(validity.startBy)}</Row>
        <Row label="Activated">{formatDateTime12(validity.activatedAt, "Not yet")}</Row>
        <Row label="Expires">{formatDateTime12(validity.expiresAt)}</Row>
        <Row label="Data used">
          <DataUsage used={validity.dataUsedBytes} total={validity.dataTotalBytes} />
        </Row>
        <Row label="Start reminders sent">{formatReminders(validity.startRemindersSent)}</Row>
      </div>
    </div>
  );
}

export function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2 justify-between">
      <span className="text-muted-foreground shrink-0">{label}</span>
      <span className="text-right">{children}</span>
    </div>
  );
}
