import { useQuery } from "@tanstack/react-query";
import { getCategories } from "../api/categoryService";

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    staleTime: 1000 * 60 * 5,
  });
}
