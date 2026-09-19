import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiClient } from "../../../config/apiClient";
import { ENV } from "../../../config/env";

export async function resolveDestinationImage(destination, fallbackCategory = "") {
  if (destination.coverImageUrl && destination.coverImageUrl.startsWith("http")) {
    return destination.coverImageUrl;
  }

  if (destination.image_url && destination.image_url.startsWith("http")) {
    return destination.image_url;
  }

  const queryTerm =
    destination.photoQuery ||
    `${destination.name || destination.title || ""} ${fallbackCategory}`.trim();

  const sanitized = String(destination.id || queryTerm).toLowerCase().replace(/[^a-z0-9]/g, "");
  const cacheKey = `@pexels_img_${sanitized}`;

  try {
    const cached = await AsyncStorage.getItem(cacheKey);
    if (cached) {
      return cached;
    }

    if (ENV.PEXELS_API_KEY && queryTerm) {
      const response = await fetch(
        `https://api.pexels.com/v1/search?query=${encodeURIComponent(queryTerm)}&per_page=3`,
        { headers: { Authorization: ENV.PEXELS_API_KEY } }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.photos && data.photos.length > 0) {
          const imgUrl = data.photos[0].src.large;
          await AsyncStorage.setItem(cacheKey, imgUrl);
          return imgUrl;
        }
      }
    }
  } catch {}

  return null;
}

export async function normalizeDestination(destination, fallbackCategory = "") {
  const imageUrl = await resolveDestinationImage(destination, fallbackCategory);

  const title = destination.name || destination.title || "";
  const location = destination.country || destination.location || "";

  const category =
    Array.isArray(destination.categories) && destination.categories.length > 0
      ? destination.categories[0]
      : destination.category || fallbackCategory;

  const realRating =
    destination.rating !== null && destination.rating !== undefined && Number(destination.rating) > 0
      ? Number(destination.rating).toFixed(1)
      : "0.0";

  return {
    ...destination,
    id: destination.id,
    title,
    name: title,
    location,
    city: destination.city,
    state: destination.state,
    country: destination.country,
    category,
    categories: destination.categories || (category ? [category] : []),
    coverImageUrl: destination.coverImageUrl || imageUrl,
    photoQuery: destination.photoQuery,
    image_url: imageUrl,
    realRating,
    rating: destination.rating ?? 0.0,
    reviewCount: destination.reviewCount ?? 0,
  };
}

export async function getDestinations({ category, name, page = 0, size = 50 } = {}) {
  const params = new URLSearchParams();
  if (category) params.append("category", category);
  if (name) params.append("name", name);
  params.append("page", String(page));
  params.append("size", String(size));

  const response = await apiClient.get(`/destinations?${params.toString()}`);
  const items = response?.content || (Array.isArray(response) ? response : []);

  return Promise.all(items.map((item) => normalizeDestination(item, category)));
}

export async function getDestinationById(id) {
  const response = await apiClient.get(`/destinations/${id}`);
  return normalizeDestination(response);
}
