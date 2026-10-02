"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  LogOut,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useState, useRef, useEffect } from "react";
import { NAVIGATION_SECTIONS } from "@/constants/navigation.constants";
import { useAuthStore } from "@/lib/stores/auth.store";
import { showSuccess } from "@/lib/utils/toast.util";
import { ROUTES } from "@/constants/routes.constants";

interface SidebarProps {
  open?: boolean;
  onClose?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function Sidebar({
  open = false,
  onClose,
  isCollapsed = false,
  onToggleCollapse,
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { admin, clearAuth } = useAuthStore();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setShowProfileMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    clearAuth();
    showSuccess("Logged out successfully");
    router.push(ROUTES.LOGIN);
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen flex flex-col bg-card border-r transition-all duration-300",
        isCollapsed ? "w-16" : "w-64",
        open ? "translate-x-0" : "-translate-x-full",
        "lg:translate-x-0"
      )}
    >
      <div className="flex items-center justify-between h-16 px-4 border-b flex-shrink-0">
        {!isCollapsed ? (
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="EasyLink"
              width={32}
              height={32}
              className="w-8 h-8 object-contain"
            />
            <p className="font-bold text-sm">EasyLink Admin</p>
          </div>
        ) : (
          <Image
            src="/logo.png"
            alt="EasyLink"
            width={32}
            height={32}
            className="w-8 h-8 object-contain mx-auto"
          />
        )}
      </div>

      <button
        onClick={onToggleCollapse}
        className="absolute -right-3 top-20 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors hidden lg:flex"
      >
        {isCollapsed ? (
          <ChevronRight className="w-4 h-4" />
        ) : (
          <ChevronLeft className="w-4 h-4" />
        )}
      </button>

      <nav className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin">
        {NAVIGATION_SECTIONS.map((section) => (
          <div key={section.title}>
            {!isCollapsed && (
              <p className="text-xs font-semibold text-muted-foreground uppercase mb-3 px-3">
                {section.title}
              </p>
            )}
            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive =
                  item.href === ROUTES.DASHBOARD
                    ? pathname === item.href
                    : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 min-h-[44px] rounded-lg text-sm font-medium transition-colors relative",
                      isActive
                        ? isCollapsed
                          ? "bg-primary/10 text-primary before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-primary before:rounded-l-lg"
                          : "bg-primary text-white"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                    )}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    {!isCollapsed && <span>{item.label}</span>}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {!isCollapsed && (
        <div className="p-4 border-t relative flex-shrink-0" ref={profileMenuRef}>
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="w-full flex items-center gap-3 hover:bg-accent rounded-lg p-2 transition-colors cursor-pointer"
          >
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
              {admin?.fullName
                ? admin.fullName.charAt(0).toUpperCase()
                : "A"}
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-sm font-medium truncate">
                {admin?.fullName || "Admin"}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {admin?.email || ""}
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          </button>

          {showProfileMenu && (
            <div className="absolute bottom-full left-4 right-4 mb-2 bg-card border rounded-lg shadow-lg py-2 z-50">
              <div className="px-4 py-2 border-b">
                <p className="text-sm font-semibold truncate">
                  {admin?.fullName || "Admin"}
                </p>
                <p className="text-xs text-muted-foreground truncate capitalize">
                  {admin?.role?.replace("_", " ") || ""}
                </p>
              </div>
              <div className="flex items-center gap-3 px-4 py-2 text-sm text-muted-foreground">
                <User className="w-4 h-4" />
                <span>{admin?.email || ""}</span>
              </div>
              <div className="border-t my-1" />
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-accent transition-colors text-red-600"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      )}
    </aside>
  );
}
