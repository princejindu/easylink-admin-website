import { apiClient } from "./client";
import { API_ENDPOINTS } from "@/constants/api.constants";
import type {
  LoginRequest,
  LoginResponse,
  ForgotPasswordRequest,
} from "@/types/auth.types";

export const authApi = {
  login: (data: LoginRequest): Promise<LoginResponse> =>
    apiClient.post<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, data),

  forgotPassword: (data: ForgotPasswordRequest): Promise<{ message: string }> =>
    apiClient.post<{ message: string }>(
      API_ENDPOINTS.AUTH.FORGOT_PASSWORD,
      data
    ),
};
