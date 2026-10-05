import { apiClient } from "../../../config/apiClient";

export async function resolveDestinationImage(destination) {
  if (destination.coverImageUrl && destination.coverImageUrl.startsWith("http")) {
    return destination.coverImageUrl;
  }

  if (destination.image_url && destination.image_url.startsWith("http")) {
    return destination.image_url;
  }

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

  const coverImageObj = Array.isArray(destination.images)
    ? (destination.images.find((img) => img.isCover) || destination.images[0])
    : null;

  const avgColor = destination.avgColor || coverImageObj?.avgColor || null;
  const alt = destination.alt || coverImageObj?.alt || title;

  let estimatedPrice = destination.price ?? null;
  let estimatedPriceRange = null;

  if (estimatedPrice == null && destination.aiCostEstimates) {
    try {
      const parsed =
        typeof destination.aiCostEstimates === "object"
          ? destination.aiCostEstimates
          : JSON.parse(destination.aiCostEstimates);
      if (parsed?.daily_total) {
        const min = parsed.daily_total.min;
        const max = parsed.daily_total.max;
        if (min != null && max != null) {
          estimatedPriceRange = `R$ ${min} - ${max}`;
          estimatedPrice = min;
        } else if (min != null) {
          estimatedPrice = min;
          estimatedPriceRange = `R$ ${min}`;
        }
      }
    } catch (_) {}
  }

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
    avgColor,
    alt,
    realRating,
    rating: destination.rating ?? 0.0,
    reviewCount: destination.reviewCount ?? 0,
    price: estimatedPrice,
    priceRange: estimatedPriceRange,
    aiCostEstimates: destination.aiCostEstimates,
  };
}

export async function getDestinations({ category, name, sortBy, page = 0, size = 50 } = {}) {
  const params = new URLSearchParams();
  if (category) params.append("category", category);
  if (name) params.append("name", name);
  if (sortBy) params.append("sortBy", sortBy);
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
