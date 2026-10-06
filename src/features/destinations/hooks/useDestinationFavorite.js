import { useState, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useFocusEffect } from "@react-navigation/native";
import {
  checkFavoriteApi,
  addFavoriteApi,
  removeFavoriteApi,
} from "../../../shared/api/favoriteApi";

export function useDestinationFavorite(item, user) {
  const queryClient = useQueryClient();
  const [isFavorited, setIsFavorited] = useState(Boolean(item?.item_id));
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);

  const loadFavoriteStatus = useCallback(async () => {
    if (!user || !item?.id) return;
    try {
      const isFav = await checkFavoriteApi(item.id);
      setIsFavorited(isFav);
    } catch {
    }
  }, [item?.id, user]);

  useFocusEffect(
    useCallback(() => {
      loadFavoriteStatus();
    }, [loadFavoriteStatus])
  );

  const toggleFavorite = useCallback(async () => {
    if (!user) {
      alert("Você precisa estar logado para favoritar.");
      return;
    }

    if (isTogglingFavorite || !item?.id) return;
    setIsTogglingFavorite(true);

    try {
      if (isFavorited) {
        setIsFavorited(false);
        await removeFavoriteApi(item.id);
      } else {
        setIsFavorited(true);
        await addFavoriteApi(item.id);
      }
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    } catch {
      setIsFavorited((prev) => !prev);
    } finally {
      setIsTogglingFavorite(false);
    }
  }, [user, isTogglingFavorite, item?.id, isFavorited, queryClient]);

  return {
    isFavorited,
    isTogglingFavorite,
    toggleFavorite,
    loadFavoriteStatus,
  };
}

export default useDestinationFavorite;
