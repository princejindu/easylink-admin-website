import { format, formatDistanceToNow } from "date-fns";

export function formatDate(date: string | Date): string {
  return format(new Date(date), "dd MMM yyyy");
}

export function formatDateTime(date: string | Date): string {
  return format(new Date(date), "dd MMM yyyy, HH:mm");
}

export function formatRelative(date: string | Date): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

export function formatCurrency(
  amount: number,
  currency: string = "GBP"
): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-GB").format(value);
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}

export function getInitials(fullName: string): string {
  return fullName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

/** "03 Nov 2026, 9:00 AM". Returns the fallback when the date is missing or invalid. */
export function formatDateTime12(
  date: string | Date | null | undefined,
  fallback = "Not set"
): string {
  if (!date) return fallback;
  const value = new Date(date);
  if (Number.isNaN(value.getTime())) return fallback;
  return format(value, "dd MMM yyyy, h:mm a");
}

/** Money that may be missing from older API builds. */
export function formatMoney(
  amount: number | null | undefined,
  currency?: string | null,
  fallback = "N/A"
): string {
  if (amount === null || amount === undefined || Number.isNaN(Number(amount))) {
    return fallback;
  }
  return formatCurrency(Number(amount), currency || "GBP");
}

const BYTE_UNITS = ["B", "KB", "MB", "GB", "TB"];

export function formatBytes(bytes: number | null | undefined): string {
  if (bytes === null || bytes === undefined || bytes < 0) return "N/A";
  let value = bytes;
  let unit = 0;
  while (value >= 1024 && unit < BYTE_UNITS.length - 1) {
    value /= 1024;
    unit += 1;
  }
  const digits = unit === 0 || value >= 100 ? 0 : value >= 10 ? 1 : 2;
  return `${value.toFixed(digits)} ${BYTE_UNITS[unit]}`;
}

/** "in 12 days", "today" or "3 days ago" for a whole number of days. */
export function formatDaysAway(days: number | null | undefined): string | null {
  if (days === null || days === undefined || Number.isNaN(Number(days))) return null;
  const n = Math.round(Number(days));
  if (n === 0) return "today";
  const unit = Math.abs(n) === 1 ? "day" : "days";
  return n > 0 ? `in ${n} ${unit}` : `${Math.abs(n)} ${unit} ago`;
}

/** Days from now until the date, rounded up. Null when the date is missing. */
export function daysUntil(date: string | null | undefined): number | null {
  if (!date) return null;
  const time = new Date(date).getTime();
  if (Number.isNaN(time)) return null;
  return Math.ceil((time - Date.now()) / 86_400_000);
}

/** "REFERRAL_REWARD" becomes "Referral reward". */
export function humanize(value: string | null | undefined, fallback = "Unknown"): string {
  if (!value) return fallback;
  const words = value.toLowerCase().split("_").join(" ").trim();
  return words ? words.charAt(0).toUpperCase() + words.slice(1) : fallback;
}
