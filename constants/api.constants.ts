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
    LIST: `${BASE}/purchases`,
    DETAIL: (id: string) => `${BASE}/purchases/${id}`,
    RESYNC: (id: string) => `${BASE}/purchases/${id}/sync`,
    CANCEL: (id: string) => `${BASE}/purchases/${id}/cancel`,
  },
  PACKAGES: {
    LIST: `/esim/packages`,
    FEATURE: (id: string) => `${BASE}/esim/featured-packages`,
    UNFEATURE: (id: string) => `${BASE}/esim/featured-packages`,
  },
  NOTIFICATIONS: {
    BROADCAST: `${BASE}/notifications/broadcast`,
    HISTORY: `${BASE}/notifications/history`,
    PREVIEW: `${BASE}/notifications/preview`,
  },
  REFERRALS: {
    COMMISSION_RATE: `${BASE}/referrals/commission-rate`,
    COMMISSIONS: `${BASE}/referrals/commissions`,
    WALLETS: `${BASE}/referrals/wallets`,
    WALLET_TRANSACTIONS: (userId: string) =>
      `${BASE}/referrals/wallets/${userId}/transactions`,
  },
  CONFIG: {
    GET: `${BASE}/esim/pricing`,
    UPDATE: `${BASE}/esim/config`,
  },
  PROVIDERS: {
    FLAGS: `${BASE}/providers`,
    UPDATE_FLAGS: (provider: string) => `${BASE}/providers/${provider}/flags`,
    LIST: `${BASE}/providers`,
    UPDATE_PROVIDER_FLAGS: (provider: string) => `${BASE}/providers/${provider}/flags`,
  },
  ANALYTICS: {
    OVERVIEW: `${BASE}/analytics/overview`,
    TOP_PACKAGES: `${BASE}/analytics/top-packages`,
    PURCHASES_BY_COUNTRY: `${BASE}/analytics/purchases-by-country`,
  },
  PURCHASES: {
    LIST: `${BASE}/purchases`,
    DETAIL: (id: string) => `${BASE}/purchases/${id}`,
    SYNC: (id: string) => `${BASE}/purchases/${id}/sync`,
    CANCEL: (id: string) => `${BASE}/purchases/${id}/cancel`,
  },
  FEATURED_PACKAGES: `${BASE}/esim/featured-packages`,
} as const;
