"use client";

import { Menu, Sun, Moon, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/stores/auth.store";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { showSuccess } from "@/lib/utils/toast.util";
import { ROUTES } from "@/constants/routes.constants";

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const router = useRouter();
  const { admin, clearAuth } = useAuthStore();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    clearAuth();
    showSuccess("Logged out successfully");
    router.push(ROUTES.LOGIN);
  };

  return (
    <header className="h-16 bg-card border-b flex items-center justify-between px-4 md:px-6 gap-4">
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 min-h-[44px] min-w-[44px] hover:bg-accent rounded-lg transition-colors flex items-center justify-center"
        aria-label="Toggle menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      <div className="hidden lg:block">
        <p className="text-sm font-medium">
          Welcome back, {admin?.fullName?.split(" ")[0] || "Admin"}
        </p>
        <p className="text-xs text-muted-foreground">EasyLink Admin Dashboard</p>
      </div>

      <div className="flex-1" />

      <div className="flex items-center gap-2">
        {mounted && (
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 min-h-[44px] min-w-[44px] hover:bg-accent rounded-lg transition-colors flex items-center justify-center"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>
        )}

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors min-h-[44px]"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}
