import { apiClient } from "../../config/apiClient";
import { resolveDestinationImage } from "./destinationApi";

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

export async function getFavoritesApi({ page = 0, size = 10, search } = {}) {
  const params = new URLSearchParams();
  if (page != null) params.append("page", String(page));
  if (size != null) params.append("size", String(size));
  if (search && search.trim()) params.append("search", search.trim());

  const query = params.toString();
  const endpoint = query ? `/favorites?${query}` : "/favorites";
  const data = await apiClient.get(endpoint);
  const list = data?.content || (Array.isArray(data) ? data : []);

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

      const imageUrl = await resolveDestinationImage(destinationLike);

      const rawRating = fav.destinationRating ?? 0.0;
      const reviewCount = Number(fav.destinationReviewCount ?? 0);
      const realRating =
        Number(rawRating) > 0
          ? Number(rawRating).toFixed(1)
          : "0.0";

      return {
        id: fav.destinationId,
        destinationId: fav.destinationId,
        item_id: fav.destinationId,
        title: fav.destinationName,
        name: fav.destinationName,
        location: fav.destinationCountry || fav.destinationCity || "",
        category: fav.destinationCategories?.[0] || "",
        categories: fav.destinationCategories || [],
        coverImageUrl: imageUrl,
        image_url: imageUrl,
        rating: rawRating,
        reviewCount,
        realRating,
        createdAt: fav.createdAt,
      };
    })
  );
}
