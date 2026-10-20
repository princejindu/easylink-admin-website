import { ShieldAlert } from "lucide-react";

export function DisputedBadge() {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
      <ShieldAlert className="w-3 h-3" aria-hidden="true" />
      Disputed
    </span>
  );
}
