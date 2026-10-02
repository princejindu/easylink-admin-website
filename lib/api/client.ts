import axios, {
  type AxiosInstance,
  type AxiosError,
  type AxiosRequestConfig,
} from "axios";
import { toast } from "sonner";
import { ROUTES } from "@/constants/routes.constants";

export interface ApiError {
  message: string;
  statusCode: number;
  errors?: string[] | Record<string, string[]>;
}

export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  statusCode?: number;
}

const getApiBaseUrl = (): string => {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "https://easylink-api-v2.onrender.com";
  return `${baseUrl}/api/v1`;
};

export class ApiClient {
  private instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL: getApiBaseUrl(),
      timeout: 30000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.instance.interceptors.request.use(
      (config) => {
        if (typeof window !== "undefined") {
          const token = localStorage.getItem("auth_token");
          if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.instance.interceptors.response.use(
      (response) => {
        if (
          response.data &&
          typeof response.data === "object" &&
          "data" in response.data
        ) {
          return response.data.data;
        }
        return response.data;
      },
      (error: AxiosError<ApiError>) => {
        if (error.response) {
          const isAuthEndpoint =
            error.config?.url?.includes("/auth/login") ||
            error.config?.url?.includes("/auth/refresh");

          if (
            error.response.status === 401 &&
            typeof window !== "undefined" &&
            !isAuthEndpoint
          ) {
            localStorage.removeItem("auth_token");
            localStorage.removeItem("auth-storage");

            toast.error("Session expired. Please login again.");

            window.location.href = ROUTES.LOGIN;

            return Promise.resolve(null);
          }

          const apiError: ApiError = {
            message: error.response.data?.message || "An error occurred",
            statusCode: error.response.status,
            errors: error.response.data?.errors,
          };

          return Promise.reject(apiError);
        } else if (error.request) {
          return Promise.reject({
            message: "Network error. Check your connection.",
            statusCode: 0,
          });
        } else {
          return Promise.reject({
            message: error.message || "An unexpected error occurred",
            statusCode: 500,
          });
        }
      }
    );
  }

  async get<T>(
    endpoint: string,
    params?: Record<string, unknown>
  ): Promise<T> {
    const config: AxiosRequestConfig = { params };
    return this.instance.get(endpoint, config) as unknown as T;
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.instance.post(endpoint, data) as unknown as T;
  }

  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.instance.put(endpoint, data) as unknown as T;
  }

  async patch<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.instance.patch(endpoint, data) as unknown as T;
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.instance.delete(endpoint) as unknown as T;
  }
}

export const apiClient = new ApiClient();
