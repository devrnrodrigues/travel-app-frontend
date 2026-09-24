import { apiClient } from "../../../config/apiClient";

export const DEFAULT_CATEGORIES = [
  { id: "1", name: "Florestas", slug: "florestas", icon: "leaf", accentColor: "#4CAF50", sortOrder: 0 },
  { id: "2", name: "Praias", slug: "praias", icon: "waves", accentColor: "#00B4D8", bgImageUrl: "https://images.pexels.com/photos/1007657/pexels-photo-1007657.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", sortOrder: 1 },
  { id: "3", name: "Montanhas", slug: "montanhas", icon: "image-filter-hdr", accentColor: "#FFA726", bgImageUrl: "https://images.pexels.com/photos/933054/pexels-photo-933054.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", sortOrder: 2 },
  { id: "4", name: "Cachoeiras", slug: "cachoeiras", icon: "waterfall", accentColor: "#80DEEA", bgImageUrl: "https://images.pexels.com/photos/14659324/pexels-photo-14659324.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", sortOrder: 3 },
  { id: "5", name: "Deserto", slug: "deserto", icon: "white-balance-sunny", accentColor: "#FF7043", bgImageUrl: "https://images.pexels.com/photos/1001435/pexels-photo-1001435.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", sortOrder: 4 },
  { id: "6", name: "Neve", slug: "neve", icon: "snowflake", accentColor: "#E0F7FA", bgImageUrl: "https://images.pexels.com/photos/839462/pexels-photo-839462.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", sortOrder: 5 },
  { id: "7", name: "Histórico", slug: "historico", icon: "pillar", accentColor: "#D4AF37", bgImageUrl: "https://images.pexels.com/photos/2044434/pexels-photo-2044434.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", sortOrder: 6 },
  { id: "8", name: "Urbano", slug: "urbano", icon: "city-variant-outline", accentColor: "#90CAF9", bgImageUrl: "https://images.pexels.com/photos/15271798/pexels-photo-15271798.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", sortOrder: 7 },
  { id: "9", name: "Ilhas", slug: "ilhas", icon: "island", accentColor: "#26A69A", bgImageUrl: "https://images.pexels.com/photos/1450360/pexels-photo-1450360.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", sortOrder: 8 },
  { id: "10", name: "Interior", slug: "interior", icon: "home-variant-outline", accentColor: "#AED581", bgImageUrl: "https://images.pexels.com/photos/16725824/pexels-photo-16725824.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", sortOrder: 9 },
];

export async function getCategories() {
  try {
    const data = await apiClient.get("/categories");
    if (Array.isArray(data) && data.length > 0) {
      return data;
    }
  } catch (error) {
  }
  return DEFAULT_CATEGORIES;
}
