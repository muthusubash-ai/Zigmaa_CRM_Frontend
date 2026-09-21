const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000/api/v1";

let accessToken: string | null = null;

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export function setAccessToken(token: string | null) {
  accessToken = token;
}

async function parseResponse(response: Response): Promise<unknown> {
  if (response.status === 204) return null;
  const contentType = response.headers.get("content-type") ?? "";
  return contentType.includes("application/json") ? response.json() : response.text();
}

function getErrorMessage(payload: unknown, fallback: string) {
  if (payload && typeof payload === "object" && "detail" in payload) {
    const detail = (payload as { detail?: unknown }).detail;
    if (typeof detail === "string") return detail;
    if (Array.isArray(detail) && typeof detail[0] === "string") return detail[0];
  }
  if (payload && typeof payload === "object" && "non_field_errors" in payload) {
    const errors = (payload as { non_field_errors?: unknown }).non_field_errors;
    if (Array.isArray(errors) && typeof errors[0] === "string") return errors[0];
  }
  if (payload && typeof payload === "object") {
    for (const value of Object.values(payload)) {
      if (typeof value === "string") return value;
      if (Array.isArray(value) && typeof value[0] === "string") return value[0];
    }
  }
  return fallback;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...options.headers,
    },
  });
  const payload = await parseResponse(response);

  if (!response.ok) {
    throw new ApiError(
      getErrorMessage(payload, `Request failed with status ${response.status}`),
      response.status,
      payload,
    );
  }

  return payload as T;
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
  retryOnUnauthorized = true,
): Promise<T> {
  try {
    return await request<T>(path, options);
  } catch (error) {
    if (!(error instanceof ApiError) || error.status !== 401 || !retryOnUnauthorized) {
      throw error;
    }

    const refreshed = await request<{ access: string }>("/auth/refresh/", {
      method: "POST",
    });
    setAccessToken(refreshed.access);
    return request<T>(path, options);
  }
}
