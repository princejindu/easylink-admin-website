"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { notificationsApi } from "@/lib/api/notifications.api";
import { showSuccess, showError } from "@/lib/utils/toast.util";
import { MESSAGES } from "@/constants/messages.constants";

interface ComposeFormProps {
  onSent: () => void;
}

export function ComposeForm({ onSent }: ComposeFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({ title: "", body: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.body.trim()) return;

    setIsLoading(true);
    try {
      await notificationsApi.broadcast(form);
      showSuccess(MESSAGES.NOTIFICATIONS.SEND_SUCCESS);
      setForm({ title: "", body: "" });
      onSent();
    } catch {
      showError("Failed to send notification");
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
            maxLength={100}
          />
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
            maxLength={500}
          />
          <p className="text-xs text-muted-foreground text-right">
            {form.body.length}/500
          </p>
        </div>

        <button
          type="submit"
          disabled={isLoading || !form.title.trim() || !form.body.trim()}
          className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white font-medium py-2.5 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-4 h-4" />
          {isLoading ? "Sending..." : "Send to All Users"}
        </button>
      </form>
    </div>
  );
}
