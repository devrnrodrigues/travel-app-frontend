import { apiClient } from "../../../config/apiClient";
import { resolveDestinationImage } from "../../destinations/api/destinationService";

export async function getFavoritesApi({ page = 0, size = 10 } = {}) {
  const params = new URLSearchParams();
  if (page != null) params.append("page", String(page));
  if (size != null) params.append("size", String(size));

  const query = params.toString();
  const endpoint = query ? `/favorites?${query}` : "/favorites";
  const data = await apiClient.get(endpoint);
  const rawList = Array.isArray(data) ? data : (data?.content || []);
  const list = size ? rawList.slice(0, size) : rawList;

  return Promise.all(
    list.map(async (fav) => {
      const destinationLike = {
        id: fav.destinationId,
        name: fav.destinationName,
        title: fav.destinationName,
        coverImageUrl: fav.destinationCoverImageUrl,
        photoQuery: fav.destinationName,
        categories: fav.destinationCategories,
        category: fav.destinationCategories?.[0] || "",
        country: fav.destinationCountry,
        city: fav.destinationCity,
      };

      const imageUrl = await resolveDestinationImage(destinationLike, destinationLike.category);

      return {
        id: fav.destinationId,
        destinationId: fav.destinationId,
        item_id: fav.destinationId,
        title: fav.destinationName,
        name: fav.destinationName,
        location: fav.destinationCountry || fav.destinationCity || "",
        category: fav.destinationCategories?.[0] || "",
        categories: fav.destinationCategories || [],
        coverImageUrl: fav.destinationCoverImageUrl || imageUrl,
        image_url: imageUrl,
        realRating: "0.0",
        createdAt: fav.createdAt,
      };
    })
  );
}

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
