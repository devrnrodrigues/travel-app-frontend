import { apiClient } from "../../../config/apiClient";

export async function getCategories() {
  const data = await apiClient.get("/categories");
  return Array.isArray(data) ? data : [];
}
