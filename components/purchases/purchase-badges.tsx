"use client";

import { cn } from "@/lib/utils/cn";

const BASE = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap";

const TONES = {
  green: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  yellow: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  blue: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  purple: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  indigo: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
  gray: "bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-400",
  red: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
} as const;

export type BadgeTone = keyof typeof TONES;

export function Pill({
  tone,
  children,
  className,
}: {
  tone: BadgeTone;
  children: React.ReactNode;
  className?: string;
}) {
  return <span className={cn(BASE, TONES[tone], className)}>{children}</span>;
}

/** Card or Commission wallet. Renders nothing when the API did not send it. */
export function PaymentMethodBadge({ method }: { method?: string | null }) {
  if (!method) return null;
  const value = method.toUpperCase();
  if (value === "WALLET") return <Pill tone="purple">Commission wallet</Pill>;
  if (value === "CARD") return <Pill tone="blue">Card</Pill>;
  return <Pill tone="gray">{method}</Pill>;
}

export function PurchaseKindBadge({ isTopup }: { isTopup?: boolean | null }) {
  if (isTopup === undefined || isTopup === null) return null;
  return isTopup ? <Pill tone="indigo">Top up</Pill> : <Pill tone="gray">eSIM</Pill>;
}

const VALIDITY: Record<string, { tone: BadgeTone; label: string }> = {
  NOT_STARTED: { tone: "yellow", label: "Not started" },
  ACTIVE: { tone: "green", label: "Active" },
  EXPIRED: { tone: "gray", label: "Ended" },
};

export function ValidityBadge({ state }: { state?: string | null }) {
  if (!state) return null;
  const config = VALIDITY[state.toUpperCase()];
  if (!config) return <Pill tone="gray">{state}</Pill>;
  return <Pill tone={config.tone}>{config.label}</Pill>;
}

/** "14 days, 3 days" or "None yet". */
export function formatReminders(days?: number[] | null): string {
  if (!Array.isArray(days) || days.length === 0) return "None yet";
  return days.map((d) => `${d} ${d === 1 ? "day" : "days"}`).join(", ");
}
