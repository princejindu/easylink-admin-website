export const ROUTES = {
  LOGIN: "/login",
  FORGOT_PASSWORD: "/forgot-password",
  DASHBOARD: "/dashboard",
  USERS: "/dashboard/users",
  USER_DETAIL: (id: string) => `/dashboard/users/${id}`,
  ORDERS: "/dashboard/orders",
  ORDER_DETAIL: (id: string) => `/dashboard/orders/${id}`,
  PACKAGES: "/dashboard/packages",
  NOTIFICATIONS: "/dashboard/notifications",
  CONFIG: "/dashboard/config",
  PROVIDERS: "/dashboard/providers",
} as const;
