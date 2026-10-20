"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Mail,
  Phone,
  Globe,
  Calendar,
  Clock,
  ShieldBan,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { StatusBadge } from "@/components/shared/status-badge";
import { StatsCard } from "@/components/shared/stats-card";
import { UserWalletCard } from "@/components/users/user-wallet-card";
import { UserTimezoneCard } from "@/components/users/user-timezone-card";
import { UserActivityTabs, type UserTabId } from "@/components/users/user-activity-tabs";
import { WalletTransactionsDrawer } from "@/components/referrals/wallet-transactions-drawer";
import { usersApi } from "@/lib/api/users.api";
import { showSuccess, showError } from "@/lib/utils/toast.util";
import { formatDate, formatDateTime12, formatCurrency } from "@/lib/utils/format.util";
import { useAuthStore } from "@/lib/stores/auth.store";
import { AdminRole } from "@/enums/admin-role.enum";
import { ROUTES } from "@/constants/routes.constants";
import type { User } from "@/types/user.types";
import {
  DollarSign,
  ShoppingBag,
  Gift,
  Users,
} from "lucide-react";

type ModalType = "suspend" | "activate" | null;

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { admin } = useAuthStore();
  const userId = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [modal, setModal] = useState<ModalType>(null);
  const [suspendReason, setSuspendReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<UserTabId>("purchases");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const closeDrawer = useCallback(() => setIsDrawerOpen(false), []);

  const isSuperAdmin = admin?.role === AdminRole.SUPER_ADMIN;

  const fetchUser = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await usersApi.detail(userId);
      setUser(data);
    } catch (err: unknown) {
      const apiErr = err as { statusCode?: number; message?: string };
      if (apiErr?.statusCode === 404) {
        setError("User not found.");
      } else {
        setError(apiErr?.message ?? "Failed to load user.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const trimmedReason = suspendReason.trim();

  const handleSuspend = async () => {
    if (!user) return;
    if (!trimmedReason) {
      showError("Enter a reason for the suspension.");
      return;
    }
    setIsSubmitting(true);
    try {
      const result = await usersApi.suspend(user.id, trimmedReason);
      if (!result) return;
      setUser((prev) =>
        prev
          ? {
              ...prev,
              status: result.status as User["status"],
              suspendedAt: result.suspendedAt,
              suspendReason: result.suspendReason,
            }
          : prev
      );
      showSuccess("User suspended.");
      setModal(null);
      setSuspendReason("");
    } catch (err: unknown) {
      const apiErr = err as { message?: string };
      showError(apiErr?.message ?? "Failed to suspend user.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleActivate = async () => {
    if (!user) return;
    setIsSubmitting(true);
    try {
      const result = await usersApi.activate(user.id);
      if (!result) return;
      setUser((prev) =>
        prev
          ? {
              ...prev,
              status: result.status as User["status"],
              suspendedAt: null,
              suspendReason: null,
            }
          : prev
      );
      showSuccess("User activated.");
      setModal(null);
    } catch (err: unknown) {
      const apiErr = err as { message?: string };
      showError(apiErr?.message ?? "Failed to activate user.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => router.push(ROUTES.USERS)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Users
        </button>
        <div className="bg-card border rounded-lg p-12 text-center">
          <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">{error ?? "User not found."}</p>
        </div>
      </div>
    );
  }

  const displayName =
    user.fullName ||
    `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() ||
    user.email;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push(ROUTES.USERS)}
            className="p-2 rounded-lg border border-input hover:bg-accent transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <PageHeader
            title={displayName}
            description={`User account details`}
          />
        </div>

        {isSuperAdmin ? (
          user.status === "suspended" ? (
            <button
              onClick={() => setModal("activate")}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition-colors"
            >
              <ShieldCheck className="w-4 h-4" />
              Activate User
            </button>
          ) : (
            <button
              onClick={() => setModal("suspend")}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors"
            >
              <ShieldBan className="w-4 h-4" />
              Suspend User
            </button>
          )
        ) : (
          <button
            disabled
            title="Only super admins can change user status"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted text-muted-foreground text-sm font-medium cursor-not-allowed opacity-50"
          >
            <ShieldBan className="w-4 h-4" />
            {user.status === "suspended" ? "Activate User" : "Suspend User"}
          </button>
        )}
      </div>

      {/* Profile card */}
      <div className="bg-card border rounded-lg p-6 space-y-4">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-lg font-semibold">{displayName}</h2>
            <p className="text-sm text-muted-foreground">{user.id}</p>
          </div>
          <StatusBadge status={user.status} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          <div className="flex items-center gap-2 text-sm">
            <Mail className="w-4 h-4 text-muted-foreground shrink-0" />
            <span className="break-all">{user.email}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Phone className="w-4 h-4 text-muted-foreground shrink-0" />
            <span>{user.phone ?? "Not provided"}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Globe className="w-4 h-4 text-muted-foreground shrink-0" />
            <span>{user.country ?? "Not set"}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-muted-foreground shrink-0" />
            <span>Joined {formatDate(user.createdAt)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-muted-foreground shrink-0" />
            <span>
              {user.lastLoginAt
                ? `Last login ${formatDateTime12(user.lastLoginAt)}`
                : "Never logged in"}
            </span>
          </div>
        </div>

        {selfReferralBlockCount(user.selfReferralBlocks) !== null && (
          <p className="text-sm text-muted-foreground">
            Self referral attempts blocked:{" "}
            <span className="font-medium text-foreground">
              {selfReferralBlockCount(user.selfReferralBlocks)}
            </span>
          </p>
        )}

        {user.status === "suspended" && user.suspendedAt && (
          <div className="mt-2 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-sm">
            <p className="font-medium text-red-700 dark:text-red-400">
              Suspended on {formatDateTime12(user.suspendedAt)}
            </p>
            {user.suspendReason && (
              <p className="text-red-600 dark:text-red-300 mt-1">
                Reason: {user.suspendReason}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Spend"
          value={formatCurrency(user.totalSpend ?? 0)}
          icon={DollarSign}
        />
        <StatsCard
          title="Purchases"
          value={user.purchaseCount ?? 0}
          icon={ShoppingBag}
        />
        <StatsCard
          title="Referral Balance"
          value={formatCurrency(user.referralBalance ?? 0)}
          icon={Gift}
        />
        <StatsCard
          title="Referrals Made"
          value={user.referralCount ?? 0}
          icon={Users}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <UserWalletCard
            wallet={user.wallet}
            referredBy={user.referredBy}
            onViewActivity={() => setActiveTab("wallet")}
            onOpenDrawer={() => setIsDrawerOpen(true)}
          />
        </div>
        <UserTimezoneCard user={user} />
      </div>

      <UserActivityTabs userId={user.id} activeTab={activeTab} onTabChange={setActiveTab} />

      {isDrawerOpen && (
        <WalletTransactionsDrawer
          wallet={{
            userId: user.id,
            name: displayName,
            email: user.email,
            availableBalance: Number(user.wallet?.availableBalance ?? 0),
            pendingBalance: Number(user.wallet?.pendingBalance ?? 0),
            totalEarned: user.wallet?.lifetimeEarned ?? undefined,
            totalSpent: user.wallet?.lifetimeSpent ?? undefined,
          }}
          onClose={closeDrawer}
        />
      )}

      {/* Suspend modal */}
      {modal === "suspend" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-card border rounded-lg p-6 w-full max-w-md space-y-4 shadow-xl">
            <h2 className="text-lg font-semibold">Suspend User</h2>
            <p className="text-sm text-muted-foreground">
              This will immediately prevent{" "}
              <span className="font-medium text-foreground">{displayName}</span>{" "}
              from logging in. Their existing sessions will be invalidated.
            </p>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="suspend-reason">
                Reason (required)
              </label>
              <textarea
                id="suspend-reason"
                rows={3}
                value={suspendReason}
                onChange={(e) => setSuspendReason(e.target.value)}
                maxLength={500}
                required
                placeholder="e.g. Suspicious payment activity"
                className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  setModal(null);
                  setSuspendReason("");
                }}
                disabled={isSubmitting}
                className="px-4 py-2 rounded-lg border border-input text-sm hover:bg-accent transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSuspend}
                disabled={isSubmitting || !trimmedReason}
                className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isSubmitting && <LoadingSpinner size="sm" />}
                Suspend User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Activate modal */}
      {modal === "activate" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-card border rounded-lg p-6 w-full max-w-md space-y-4 shadow-xl">
            <h2 className="text-lg font-semibold">Activate User</h2>
            <p className="text-sm text-muted-foreground">
              This will restore login access for{" "}
              <span className="font-medium text-foreground">{displayName}</span>{" "}
              immediately.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setModal(null)}
                disabled={isSubmitting}
                className="px-4 py-2 rounded-lg border border-input text-sm hover:bg-accent transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleActivate}
                disabled={isSubmitting}
                className="px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isSubmitting && <LoadingSpinner size="sm" />}
                Activate User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/** The API may send a count or a list. Null when it sends nothing usable. */
function selfReferralBlockCount(value: unknown): number | null {
  if (typeof value === "number") return value;
  if (Array.isArray(value)) return value.length;
  return null;
}
