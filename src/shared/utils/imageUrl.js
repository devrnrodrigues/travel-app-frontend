export function getOptimizedImageUrl(url, width) {
  if (!url || typeof url !== "string") return url;
  if (!url.includes("images.pexels.com")) return url;
  const baseUrl = url.split("?")[0];
  if (!width) return `${baseUrl}?auto=compress&cs=tinysrgb`;
  return `${baseUrl}?auto=compress&cs=tinysrgb&w=${width}`;
}
