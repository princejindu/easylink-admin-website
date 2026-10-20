"use client";

import Link from "next/link";
import { Wallet } from "lucide-react";
import { ROUTES } from "@/constants/routes.constants";
import {
  daysUntil,
  formatDateTime12,
  formatDaysAway,
  formatMoney,
} from "@/lib/utils/format.util";
import type { ReferredBy, UserWallet } from "@/types/user.types";

interface UserWalletCardProps {
  wallet?: UserWallet | null;
  referredBy?: ReferredBy | null;
  onViewActivity: () => void;
  onOpenDrawer: () => void;
}

function Stat({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className={strong ? "text-xl font-semibold tabular-nums" : "text-base font-medium tabular-nums"}>
        {value}
      </dd>
    </div>
  );
}

function NextRelease({ wallet }: { wallet: UserWallet }) {
  if (!wallet.nextReleaseAt) {
    return <p className="text-sm text-muted-foreground">Next release: nothing pending.</p>;
  }
  const away = formatDaysAway(daysUntil(wallet.nextReleaseAt));
  return (
    <p className="text-sm">
      <span className="text-muted-foreground">Next release: </span>
      <span className="font-medium">{formatMoney(wallet.nextReleaseAmount, wallet.currency)}</span>
      {" on "}
      {formatDateTime12(wallet.nextReleaseAt)}
      {away && <span className="text-muted-foreground"> ({away})</span>}
    </p>
  );
}

export function UserWalletCard({ wallet, referredBy, onViewActivity, onOpenDrawer }: UserWalletCardProps) {
  const currency = wallet?.currency;

  return (
    <div className="bg-card border rounded-lg p-6 space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
          <Wallet className="w-4 h-4" />
          Commission wallet
        </div>
        <div className="flex gap-2">
          <button
            onClick={onViewActivity}
            className="px-3 py-1.5 rounded-lg border border-input text-xs font-medium hover:bg-accent transition-colors"
          >
            Wallet activity
          </button>
          <button
            onClick={onOpenDrawer}
            className="px-3 py-1.5 rounded-lg border border-input text-xs font-medium hover:bg-accent transition-colors"
          >
            Open transactions
          </button>
        </div>
      </div>

      {wallet ? (
        <>
          <dl className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Stat label="Available" value={formatMoney(wallet.availableBalance, currency, formatMoney(0, currency))} strong />
            <Stat label="Pending" value={formatMoney(wallet.pendingBalance, currency, formatMoney(0, currency))} />
            <Stat label="Lifetime earned" value={formatMoney(wallet.lifetimeEarned, currency)} />
            <Stat label="Lifetime spent" value={formatMoney(wallet.lifetimeSpent, currency)} />
          </dl>
          <NextRelease wallet={wallet} />
        </>
      ) : (
        <p className="text-sm text-muted-foreground">No wallet yet.</p>
      )}

      <p className="text-sm">
        <span className="text-muted-foreground">Referred by: </span>
        {referredBy?.id ? (
          <>
            <Link href={ROUTES.USER_DETAIL(referredBy.id)} className="text-primary hover:underline">
              {referredBy.name || referredBy.email || "Unnamed user"}
            </Link>
            {referredBy.code && (
              <span className="text-muted-foreground"> (code {referredBy.code})</span>
            )}
          </>
        ) : (
          "Nobody"
        )}
      </p>
    </div>
  );
}
