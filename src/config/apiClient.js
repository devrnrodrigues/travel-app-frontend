import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ENV } from "./env";

const BASE_URL = (ENV.API_URL || "").replace(/\/$/, "");

function requestFormDataXhr(url, config) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(config.method || "POST", url);

    if (config.headers) {
      Object.entries(config.headers).forEach(([key, value]) => {
        if (key.toLowerCase() !== "content-type" && value) {
          xhr.setRequestHeader(key, String(value));
        }
      });
    }

    xhr.onload = () => {
      if (xhr.status === 204) {
        resolve(null);
        return;
      }

      let data = null;
      const text = xhr.responseText;
      if (text) {
        try {
          data = JSON.parse(text);
        } catch {
          data = text;
        }
      }

      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(data);
      } else {
        let errorMessage =
          (data && typeof data === "object" && (data.message || data.error)) ||
          "Não foi possível completar a solicitação. Tente novamente mais tarde.";

        if (data && typeof data === "object" && data.fieldErrors && typeof data.fieldErrors === "object") {
          const errorValues = Object.values(data.fieldErrors).filter(Boolean);
          if (errorValues.length > 0) {
            errorMessage = errorValues[0];
          }
        }

        const error = new Error(errorMessage);
        error.status = xhr.status;
        error.data = data;
        reject(error);
      }
    };

    xhr.onerror = () => {
      const error = new Error("Não foi possível conectar ao servidor.");
      reject(error);
    };

    xhr.send(config.body);
  });
}

async function request(endpoint, options = {}, isRetry = false) {
  const url = endpoint.startsWith("http")
    ? endpoint
    : `${BASE_URL}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;

  const token = await AsyncStorage.getItem("accessToken");

  const isFormData =
    options.body instanceof FormData ||
    Boolean(options.body && typeof options.body.append === "function");

  const headers = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  if (isFormData) {
    delete headers["Content-Type"];
  }

  const config = {
    ...options,
    headers,
  };

  if (config.body && typeof config.body === "object" && !isFormData) {
    config.body = JSON.stringify(config.body);
  }

  if (isFormData && Platform.OS !== "web") {
    try {
      return await requestFormDataXhr(url, config);
    } catch (err) {
      if (err.status === 401 && !isRetry && !endpoint.includes("/auth/")) {
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
      throw err;
    }
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
      let errorMessage =
        (data && typeof data === "object" && (data.message || data.error)) ||
        "Não foi possível completar a solicitação. Tente novamente mais tarde.";

      if (data && typeof data === "object" && data.fieldErrors && typeof data.fieldErrors === "object") {
        const errorValues = Object.values(data.fieldErrors).filter(Boolean);
        if (errorValues.length > 0) {
          errorMessage = errorValues[0];
        }
      }

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
