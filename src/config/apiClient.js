import AsyncStorage from "@react-native-async-storage/async-storage";
import { ENV } from "./env";

const BASE_URL = (ENV.API_URL || "").replace(/\/$/, "");

async function request(endpoint, options = {}, isRetry = false) {
  const url = endpoint.startsWith("http")
    ? endpoint
    : `${BASE_URL}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;

  const token = await AsyncStorage.getItem("accessToken");

  const isFormData =
    options.body instanceof FormData ||
    Boolean(options.body && typeof options.body.append === "function") ||
    Boolean(options.body && options.body._parts !== undefined);

  const headers = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  if (isFormData) {
    delete headers["Content-Type"];
    delete headers["content-type"];
  }

  const config = {
    ...options,
    headers,
  };

  if (config.body && typeof config.body === "object" && !isFormData) {
    config.body = JSON.stringify(config.body);
  }

  try {
    const response = await fetch(url, config);

    if (response.status === 204) {
      return null;
    }

    if (response.status === 401 && !isRetry && !endpoint.includes("/auth/")) {
      const storedRefreshToken = await AsyncStorage.getItem("refreshToken");
      if (storedRefreshToken) {
        try {
          const refreshRes = await fetch(`${BASE_URL}/auth/refresh`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken: storedRefreshToken }),
          });
          if (refreshRes.ok) {
            const tokenData = await refreshRes.json();
            if (tokenData?.accessToken) {
              await AsyncStorage.setItem("accessToken", tokenData.accessToken);
              if (tokenData.refreshToken) {
                await AsyncStorage.setItem("refreshToken", tokenData.refreshToken);
              }
              return request(endpoint, options, true);
            }
          }
        } catch {}
      }
      await AsyncStorage.multiRemove(["accessToken", "refreshToken", "currentUser"]);
      const error = new Error("Sessão expirada. Faça login novamente.");
      error.status = 401;
      throw error;
    }

    const text = await response.text();
    let data = null;
    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        data = text;
      }
    }

    if (!response.ok) {
      const errorMessage =
        (data && typeof data === "object" && (data.message || data.error)) ||
        "Não foi possível completar a solicitação. Tente novamente mais tarde.";
      const error = new Error(errorMessage);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (err) {
    throw err;
  }
}

export const apiClient = {
  get: (endpoint, options) => request(endpoint, { method: "GET", ...options }),
  post: (endpoint, body, options) => request(endpoint, { method: "POST", body, ...options }),
  put: (endpoint, body, options) => request(endpoint, { method: "PUT", body, ...options }),
  delete: (endpoint, options) => request(endpoint, { method: "DELETE", ...options }),
};
