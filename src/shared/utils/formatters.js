export const parsePrice = (price) => {
  if (price === null || price === undefined || price === "") return null;
  if (typeof price === "number") return isNaN(price) ? null : price;
  const cleaned = String(price).replace(/[^0-9.-]+/g, "");
  const num = parseFloat(cleaned);
  return isNaN(num) ? null : num;
};

export const parseRating = (rating) => {
  if (rating === null || rating === undefined || rating === "N/A" || rating === "") return 0;
  const num = parseFloat(rating);
  return isNaN(num) ? 0 : num;
};

export const formatPrice = (units = 0, nanos = 0) =>
  (units + nanos / 1_000_000_000).toFixed(2);

export const priceValue = (units = 0, nanos = 0) =>
  units + nanos / 1_000_000_000;

export const extractTime = (dateStr) => (dateStr ? dateStr.slice(11, 16) : null);

export const formatDuration = (seconds) => {
  if (!seconds) return null;
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${h}h ${String(m).padStart(2, "0")}m`;
};
