import { useState, useRef, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { removeFavoriteApi } from "../api/favoriteService";

export function useFavoriteDelete() {
  const queryClient = useQueryClient();
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const lastItemTitleRef = useRef("");

  if (itemToDelete?.title) {
    lastItemTitleRef.current = itemToDelete.title;
  }

  const confirmDelete = useCallback(async () => {
    if (!itemToDelete) return;
    try {
      setIsDeleting(true);
      const destId = itemToDelete.destinationId || itemToDelete.id || itemToDelete.item_id;
      await removeFavoriteApi(destId);

      queryClient.setQueriesData({ queryKey: ["favorites"] }, (old) => {
        if (!old) return old;
        if (old.pages) {
          return {
            ...old,
            pages: old.pages.map((page) =>
              page.filter((fav) => (fav.destinationId || fav.id) !== destId)
            ),
          };
        }
        return (old || []).filter((fav) => (fav.destinationId || fav.id) !== destId);
      });
      setItemToDelete(null);
    } catch {
    } finally {
      setIsDeleting(false);
    }
  }, [itemToDelete, queryClient]);

  const cancelDelete = useCallback(() => {
    if (!isDeleting) {
      setItemToDelete(null);
    }
  }, [isDeleting]);

  return {
    itemToDelete,
    setItemToDelete,
    isDeleting,
    lastItemTitleRef,
    confirmDelete,
    cancelDelete,
  };
}

export default useFavoriteDelete;
