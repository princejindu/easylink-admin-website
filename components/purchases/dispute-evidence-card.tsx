"use client";

import { Copy } from "lucide-react";
import { formatDateTime } from "@/lib/utils/format.util";
import { showError, showSuccess } from "@/lib/utils/toast.util";
import type { PurchaseDetail } from "@/types/purchase.types";

interface DisputeEvidenceCardProps {
  purchase: PurchaseDetail;
  disputed: boolean;
}

const NOT_RECORDED = "Not recorded";

function formatOptionalDate(value: string | null | undefined): string {
  return value ? formatDateTime(value) : NOT_RECORDED;
}

export function DisputeEvidenceCard({ purchase, disputed }: DisputeEvidenceCardProps) {
  const fields = [
    { label: "Order number", value: purchase.orderReference || purchase.id, mono: true },
    { label: "Paid at", value: formatOptionalDate(purchase.paidAt) },
    { label: "ICCID", value: purchase.iccid || NOT_RECORDED, mono: true },
    { label: "Delivered at", value: formatOptionalDate(purchase.deliveredAt) },
    { label: "Activated at", value: formatOptionalDate(purchase.activatedAt) },
  ];

  const copyAll = async () => {
    const text = fields.map((f) => `${f.label}: ${f.value}`).join("\n");
    try {
      await navigator.clipboard.writeText(text);
      showSuccess("Evidence copied");
    } catch {
      showError("Could not copy. Select the text and copy it by hand.");
    }
  };

  return (
    <section
      aria-labelledby="dispute-evidence-heading"
      className={
        disputed
          ? "bg-card border border-red-300 dark:border-red-800 rounded-lg p-6 space-y-4 lg:col-span-2"
          : "bg-card border rounded-lg p-6 space-y-4 lg:col-span-2"
      }
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 id="dispute-evidence-heading" className="text-sm font-semibold text-muted-foreground">
            Dispute evidence
          </h2>
          <p className="text-xs text-muted-foreground">
            Copy these into the Stripe dispute response.
          </p>
        </div>
        <button
          onClick={copyAll}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-input text-xs font-medium hover:bg-accent transition-colors"
        >
          <Copy className="w-3.5 h-3.5" />
          Copy all
        </button>
      </div>
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
        {fields.map((f) => (
          <div key={f.label} className="flex items-start justify-between gap-2">
            <dt className="text-muted-foreground shrink-0">{f.label}</dt>
            <dd className={f.mono ? "font-mono text-xs text-right break-all select-all" : "text-right select-all"}>
              {f.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
