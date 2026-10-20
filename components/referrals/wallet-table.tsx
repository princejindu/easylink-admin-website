"use client";

import { ChevronRight } from "lucide-react";
import { formatCurrency } from "@/lib/utils/format.util";
import type { ReferralWallet } from "@/types/referrals.types";

interface WalletTableProps {
  wallets: ReferralWallet[];
  emptyMessage: string;
  onSelect: (wallet: ReferralWallet) => void;
}

const HEADER_CLASS = "px-4 py-3 font-medium text-muted-foreground";

export function WalletTable({ wallets, emptyMessage, onSelect }: WalletTableProps) {
  if (!wallets.length) {
    return (
      <div className="bg-card border rounded-lg p-12 text-center text-muted-foreground">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="bg-card border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className={`text-left ${HEADER_CLASS}`}>User</th>
              <th className={`text-right ${HEADER_CLASS}`}>Available</th>
              <th className={`text-right ${HEADER_CLASS}`}>Pending</th>
              <th className={`text-right ${HEADER_CLASS} hidden sm:table-cell`}>
                Total earned
              </th>
              <th className={`text-right ${HEADER_CLASS} hidden md:table-cell`}>
                Total spent
              </th>
              <th className="w-10" aria-hidden="true" />
            </tr>
          </thead>
          <tbody>
            {wallets.map((wallet) => (
              <tr
                key={wallet.userId}
                tabIndex={0}
                role="button"
                aria-label={`View wallet transactions for ${wallet.name || wallet.email}`}
                onClick={() => onSelect(wallet)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onSelect(wallet);
                  }
                }}
                className="group border-b last:border-0 cursor-pointer hover:bg-accent/50 focus-visible:outline-none focus-visible:bg-accent/50 transition-colors"
              >
                <td className="px-4 py-3">
                  <div className="font-medium">{wallet.name || "Unnamed user"}</div>
                  <div className="text-xs text-muted-foreground">{wallet.email}</div>
                </td>
                <td className="px-4 py-3 text-right font-semibold tabular-nums">
                  {formatCurrency(wallet.availableBalance)}
                </td>
                <td className="px-4 py-3 text-right tabular-nums text-yellow-700 dark:text-yellow-400">
                  {formatCurrency(wallet.pendingBalance)}
                </td>
                <td className="px-4 py-3 text-right tabular-nums text-green-700 dark:text-green-400 hidden sm:table-cell">
                  {formatCurrency(wallet.totalEarned)}
                </td>
                <td className="px-4 py-3 text-right tabular-nums text-muted-foreground hidden md:table-cell">
                  {formatCurrency(wallet.totalSpent)}
                </td>
                <td className="px-2 py-3 text-muted-foreground">
                  <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
