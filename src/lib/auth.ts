import { apiRequest, setAccessToken } from "@/lib/api";

export interface AuthUser {
  id: number;
  email: string;
  full_name: string;
  phone: string;
  profile_image: string | null;
  role: "Super Admin" | "HR" | "Team Leader" | "Employee" | string;
}

interface AuthResponse {
  access: string;
  user: AuthUser;
}

function acceptAuthResponse(response: AuthResponse) {
  setAccessToken(response.access);
  return response.user;
}

export async function loginWithPassword(email: string, password: string) {
  const response = await apiRequest<AuthResponse>(
    "/auth/login/",
    {
      method: "POST",
      body: JSON.stringify({ email, password }),
    },
    false,
  );
  return acceptAuthResponse(response);
}

export async function loginWithGoogle(credential: string) {
  const response = await apiRequest<AuthResponse>(
    "/auth/google/",
    {
      method: "POST",
      body: JSON.stringify({ credential }),
    },
    false,
  );
  return acceptAuthResponse(response);
}

export interface ForgotPasswordResponse {
  detail: string;
  reset_link?: string;
}

export function requestPasswordReset(email: string) {
  return apiRequest<ForgotPasswordResponse>(
    "/auth/password/forgot/",
    {
      method: "POST",
      body: JSON.stringify({ email }),
    },
    false,
  );
}

export function resetPassword(
  uid: string,
  token: string,
  newPassword: string,
  confirmPassword: string,
) {
  return apiRequest<{ detail: string }>(
    "/auth/password/reset/",
    {
      method: "POST",
      body: JSON.stringify({
        uid,
        token,
        new_password: newPassword,
        confirm_password: confirmPassword,
      }),
    },
    false,
  );
}

export function getCurrentUser() {
  return apiRequest<AuthUser>("/auth/me/");
}

export async function logout() {
  setAccessToken(null);
  await apiRequest<null>("/auth/logout/", { method: "POST" }, false);
}
