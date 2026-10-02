const BASE = "/admin";

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${BASE}/auth/login`,
    FORGOT_PASSWORD: `${BASE}/auth/forgot-password`,
  },
  USERS: {
    LIST: `${BASE}/users`,
    DETAIL: (id: string) => `${BASE}/users/${id}`,
    SUSPEND: (id: string) => `${BASE}/users/${id}/suspend`,
    ACTIVATE: (id: string) => `${BASE}/users/${id}/activate`,
  },
  ORDERS: {
    LIST: `${BASE}/orders`,
    DETAIL: (id: string) => `${BASE}/orders/${id}`,
    RESYNC: (id: string) => `${BASE}/orders/${id}/resync`,
    CANCEL: (id: string) => `${BASE}/orders/${id}`,
  },
  PACKAGES: {
    LIST: `${BASE}/packages`,
    FEATURE: (id: string) => `${BASE}/packages/${id}/feature`,
    UNFEATURE: (id: string) => `${BASE}/packages/${id}/unfeature`,
  },
  NOTIFICATIONS: {
    BROADCAST: `${BASE}/notifications/broadcast`,
    HISTORY: `${BASE}/notifications/history`,
  },
  CONFIG: {
    GET: `${BASE}/config`,
    UPDATE: `${BASE}/config`,
  },
  PROVIDERS: {
    FLAGS: `${BASE}/providers/flags`,
    UPDATE_FLAGS: `${BASE}/providers/flags`,
  },
  ANALYTICS: {
    OVERVIEW: `${BASE}/analytics/overview`,
  },
} as const;
