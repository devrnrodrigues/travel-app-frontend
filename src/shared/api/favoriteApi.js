import { apiClient } from "../../config/apiClient";

export async function checkFavoriteApi(destinationId) {
  if (!destinationId) return false;
  try {
    const data = await apiClient.get(`/favorites/${destinationId}/check`);
    return !!data?.isFavorite;
  } catch {
    return false;
  }
}

export async function addFavoriteApi(destinationId) {
  return apiClient.post(`/favorites/${destinationId}`, {});
}

export async function removeFavoriteApi(destinationId) {
  return apiClient.delete(`/favorites/${destinationId}`);
}
