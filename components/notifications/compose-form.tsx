"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { notificationsApi } from "@/lib/api/notifications.api";
import { showSuccess, showError } from "@/lib/utils/toast.util";
import { getErrorMessage } from "@/lib/utils/error.util";
import { MESSAGES } from "@/constants/messages.constants";
import type {
  BroadcastTarget,
  PurchaseStatus,
} from "@/types/config.types";

interface ComposeFormProps {
  onSent: () => void;
}

const TARGET_LABELS: Record<BroadcastTarget, string> = {
  all: "All Users",
  country: "By Country",
  purchase_status: "By Purchase Status",
};

const PURCHASE_STATUSES: PurchaseStatus[] = [
  "active",
  "completed",
  "pending",
  "failed",
];

export function ComposeForm({ onSent }: ComposeFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState<{
    title: string;
    body: string;
    target: BroadcastTarget;
    countryCode: string;
    status: PurchaseStatus | "";
  }>({ title: "", body: "", target: "all", countryCode: "", status: "" });

  const filters: Record<string, unknown> =
    form.target === "country"
      ? { countryCode: form.countryCode.trim().toUpperCase() }
      : form.target === "purchase_status"
        ? { status: form.status }
        : {};

  const filterSummary =
    form.target === "country"
      ? form.countryCode.trim().toUpperCase()
      : form.target === "purchase_status"
        ? form.status
        : "";

  const filtersValid =
    form.target === "all" ||
    (form.target === "country" && /^[A-Za-z]{2}$/.test(form.countryCode.trim())) ||
    (form.target === "purchase_status" && form.status !== "");

  const canSubmit =
    form.title.trim().length > 0 &&
    form.body.trim().length > 0 &&
    filtersValid &&
    !isLoading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setIsLoading(true);
    let recipientCount = 0;
    try {
      const preview = await notificationsApi.preview({
        title: form.title.trim(),
        body: form.body.trim(),
        target: form.target,
        filters,
      });
      recipientCount = preview.recipientCount;
    } catch (error) {
      showError(getErrorMessage(error, "Failed to preview recipient count"));
      setIsLoading(false);
      return;
    }

    if (recipientCount === 0) {
      showError("0 users match this target. Adjust the filters before sending.");
      setIsLoading(false);
      return;
    }

    const confirmed = window.confirm(
      `Send this notification?\n\nTitle: ${form.title.trim()}\nTarget: ${TARGET_LABELS[form.target]}${
        form.target !== "all" ? ` (${filterSummary})` : ""
      }\nRecipients: ${recipientCount}\n\nThis cannot be undone.`
    );
    if (!confirmed) {
      setIsLoading(false);
      return;
    }

    try {
      const result = await notificationsApi.broadcast({
        title: form.title.trim(),
        body: form.body.trim(),
        target: form.target,
        filters,
      });
      if (result.recipientCount === 0) {
        showError("Notification sent but no users matched the filter");
      } else {
        showSuccess(`${MESSAGES.NOTIFICATIONS.SEND_SUCCESS} (${result.recipientCount} recipients)`);
      }
      setForm({ title: "", body: "", target: "all", countryCode: "", status: "" });
      onSent();
    } catch (error) {
      showError(getErrorMessage(error, "Failed to send notification"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-card border rounded-lg p-6">
      <h2 className="text-lg font-semibold mb-4">Compose Broadcast</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Title</label>
          <input
            type="text"
            placeholder="Notification title"
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            disabled={isLoading}
            maxLength={65}
          />
          <p className="text-xs text-muted-foreground text-right">
            {form.title.length}/65
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Message</label>
          <textarea
            placeholder="Write your notification message..."
            required
            value={form.body}
            onChange={(e) => setForm({ ...form, body: e.target.value })}
            rows={5}
            className="w-full px-4 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            disabled={isLoading}
            maxLength={200}
          />
          <p className="text-xs text-muted-foreground text-right">
            {form.body.length}/200
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Target</label>
          <select
            value={form.target}
            onChange={(e) =>
              setForm({
                ...form,
                target: e.target.value as BroadcastTarget,
                countryCode: "",
                status: "",
              })
            }
            disabled={isLoading}
            className="w-full px-4 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Users</option>
            <option value="country">By Country</option>
            <option value="purchase_status">By Purchase Status</option>
          </select>
        </div>

        {form.target === "country" && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Country Code</label>
            <input
              type="text"
              placeholder="e.g. NG"
              value={form.countryCode}
              onChange={(e) => setForm({ ...form, countryCode: e.target.value })}
              maxLength={2}
              disabled={isLoading}
              className="w-full px-4 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        )}

        {form.target === "purchase_status" && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Purchase Status</label>
            <select
              value={form.status}
              onChange={(e) =>
                setForm({ ...form, status: e.target.value as PurchaseStatus })
              }
              disabled={isLoading}
              className="w-full px-4 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select status...</option>
              {PURCHASE_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>
          </div>
        )}

        {(form.title || form.body) && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Preview</label>
            <div className="p-4 border rounded-lg bg-muted/30 space-y-1">
              <p className="text-sm font-semibold">{form.title || "Untitled"}</p>
              <p className="text-sm text-muted-foreground">{form.body || "…"}</p>
              <p className="text-xs text-muted-foreground">
                To: {TARGET_LABELS[form.target]}
                {form.target !== "all" ? ` · ${filterSummary}` : ""}
              </p>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={!canSubmit}
          className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white font-medium py-2.5 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-4 h-4" />
          {isLoading ? "Sending..." : form.target === "all" ? "Send to All Users" : "Send Broadcast"}
        </button>
      </form>
    </div>
  );
}
