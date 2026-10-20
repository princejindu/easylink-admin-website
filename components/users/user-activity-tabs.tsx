"use client";

import { cn } from "@/lib/utils/cn";
import { PurchasesTab } from "@/components/users/tabs/purchases-tab";
import { WalletActivityTab } from "@/components/users/tabs/wallet-activity-tab";
import { CommissionsTab } from "@/components/users/tabs/commissions-tab";
import { ReferredFriendsTab } from "@/components/users/tabs/referred-friends-tab";
import { NotificationsTab } from "@/components/users/tabs/notifications-tab";

const TABS = [
  { id: "purchases", label: "Purchases" },
  { id: "wallet", label: "Wallet activity" },
  { id: "commissions", label: "Commissions earned" },
  { id: "friends", label: "Referred friends" },
  { id: "notifications", label: "Notifications" },
] as const;

export type UserTabId = (typeof TABS)[number]["id"];

interface UserActivityTabsProps {
  userId: string;
  activeTab: UserTabId;
  onTabChange: (tab: UserTabId) => void;
}

export function UserActivityTabs({ userId, activeTab, onTabChange }: UserActivityTabsProps) {
  return (
    <div className="space-y-4">
      <div role="tablist" aria-label="User activity" className="flex gap-1 border-b overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            id={`user-tab-${tab.id}`}
            aria-selected={activeTab === tab.id}
            aria-controls={`user-panel-${tab.id}`}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "px-4 py-2 -mb-px text-sm font-medium border-b-2 whitespace-nowrap transition-colors",
              activeTab === tab.id
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <section
        id={`user-panel-${activeTab}`}
        role="tabpanel"
        aria-labelledby={`user-tab-${activeTab}`}
      >
        {activeTab === "purchases" && <PurchasesTab userId={userId} />}
        {activeTab === "wallet" && <WalletActivityTab userId={userId} />}
        {activeTab === "commissions" && <CommissionsTab userId={userId} />}
        {activeTab === "friends" && <ReferredFriendsTab userId={userId} />}
        {activeTab === "notifications" && <NotificationsTab userId={userId} />}
      </section>
    </div>
  );
}
