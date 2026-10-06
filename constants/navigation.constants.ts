import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  CreditCard,
  Wifi,
  Bell,
  Settings,
  Server,
  BarChart3,
  type LucideIcon,
} from "lucide-react";
import { ROUTES } from "./routes.constants";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export const NAVIGATION_SECTIONS: NavSection[] = [
  {
    title: "MAIN",
    items: [
      {
        label: "Dashboard",
        href: ROUTES.DASHBOARD,
        icon: LayoutDashboard,
      },
      {
        label: "Analytics",
        href: ROUTES.ANALYTICS,
        icon: BarChart3,
      },
      {
        label: "Users",
        href: ROUTES.USERS,
        icon: Users,
      },
      {
        label: "Orders",
        href: ROUTES.ORDERS,
        icon: ShoppingCart,
      },
      {
        label: "Purchases",
        href: ROUTES.PURCHASES,
        icon: CreditCard,
      },
      {
        label: "eSIM Packages",
        href: ROUTES.PACKAGES,
        icon: Wifi,
      },
    ],
  },
  {
    title: "MANAGEMENT",
    items: [
      {
        label: "Notifications",
        href: ROUTES.NOTIFICATIONS,
        icon: Bell,
      },
      {
        label: "System Config",
        href: ROUTES.CONFIG,
        icon: Settings,
      },
      {
        label: "Providers",
        href: ROUTES.PROVIDERS,
        icon: Server,
      },
    ],
  },
];
