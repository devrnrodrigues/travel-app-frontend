import { apiClient } from "../../../config/apiClient";

export async function loginApi(email, password) {
  return apiClient.post("/auth/login", {
    email: email.trim(),
    password,
  });
}

export async function registerApi({ fullName, email, password }) {
  return apiClient.post("/auth/register", {
    fullName: fullName.trim(),
    email: email.trim(),
    password,
  });
}

export async function loginWithGoogleApi(idToken) {
  return apiClient.post("/auth/google", {
    idToken,
  });
}

export async function refreshTokenApi(refreshToken) {
  return apiClient.post("/auth/refresh", {
    refreshToken,
  });
}

export async function logoutApi(refreshToken) {
  if (!refreshToken) return null;
  try {
    return await apiClient.post("/auth/logout", {
      refreshToken,
    });
  } catch {
    return null;
  }
}
