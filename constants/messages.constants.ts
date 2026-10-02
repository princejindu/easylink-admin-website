export const MESSAGES = {
  AUTH: {
    LOGIN_SUCCESS: "Logged in successfully",
    LOGOUT_SUCCESS: "Logged out successfully",
    SESSION_EXPIRED: "Session expired. Please login again.",
    FORGOT_PASSWORD_SENT: "Password reset email sent. Check your inbox.",
  },
  USERS: {
    SUSPEND_SUCCESS: "User suspended successfully",
    ACTIVATE_SUCCESS: "User activated successfully",
    FETCH_ERROR: "Failed to load users",
  },
  ORDERS: {
    RESYNC_SUCCESS: "Order resynced successfully",
    CANCEL_SUCCESS: "Order cancelled and refunded",
    FETCH_ERROR: "Failed to load orders",
  },
  PACKAGES: {
    FEATURE_SUCCESS: "Package added to featured shelf",
    UNFEATURE_SUCCESS: "Package removed from featured shelf",
    FETCH_ERROR: "Failed to load packages",
  },
  NOTIFICATIONS: {
    SEND_SUCCESS: "Broadcast notification sent",
    FETCH_ERROR: "Failed to load notification history",
  },
  CONFIG: {
    SAVE_SUCCESS: "System configuration saved",
    FETCH_ERROR: "Failed to load configuration",
  },
  PROVIDERS: {
    SAVE_SUCCESS: "Provider flags updated",
    FETCH_ERROR: "Failed to load provider flags",
  },
  GENERIC: {
    NETWORK_ERROR: "Network error. Check your connection.",
    UNEXPECTED_ERROR: "An unexpected error occurred",
  },
} as const;
