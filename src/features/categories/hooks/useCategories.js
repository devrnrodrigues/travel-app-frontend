import { useQuery } from "@tanstack/react-query";
import { getCategories, DEFAULT_CATEGORIES } from "../api/categoryService";

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    placeholderData: DEFAULT_CATEGORIES,
    staleTime: 1000 * 60 * 5,
  });
}
