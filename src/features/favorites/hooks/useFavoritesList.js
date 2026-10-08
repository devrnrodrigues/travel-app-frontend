import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Animated } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { getFavoritesApi } from "../api/favoriteService";

const PAGE_SIZE = 10;

export function useFavoritesList(user) {
  const userId = user?.id || user?._id || "anon";

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const flatListRef = useRef(null);
  const scrollY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 350);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const normalizedSearch = debouncedSearch.trim();

  useEffect(() => {
    scrollY.setValue(0);
    flatListRef.current?.scrollToOffset({ offset: 0, animated: false });
    const raf = requestAnimationFrame(() => {
      scrollY.setValue(0);
      flatListRef.current?.scrollToOffset({ offset: 0, animated: false });
    });
    return () => cancelAnimationFrame(raf);
  }, [normalizedSearch, scrollY]);

  const handleClearSearch = useCallback(() => {
    setSearchQuery("");
    setDebouncedSearch("");
    scrollY.setValue(0);
    flatListRef.current?.scrollToOffset({ offset: 0, animated: false });
    requestAnimationFrame(() => {
      scrollY.setValue(0);
      flatListRef.current?.scrollToOffset({ offset: 0, animated: false });
    });
  }, [scrollY]);

  const {
    data,
    isLoading,
    isRefetching,
    refetch,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["favorites", userId, normalizedSearch],
    enabled: !!user,
    queryFn: async ({ pageParam = 0 }) => {
      return getFavoritesApi({
        page: pageParam,
        size: PAGE_SIZE,
        search: normalizedSearch || undefined,
      });
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      if (!lastPage || lastPage.length < PAGE_SIZE) {
        return undefined;
      }
      return lastPageParam + 1;
    },
    staleTime: 1000 * 60 * 5,
  });

  const { data: isFavoritesHidden } = useQuery({
    queryKey: ["hideFavorites"],
    queryFn: async () => {
      const val = await AsyncStorage.getItem("@debug_hide_favorites");
      return val === "true";
    },
    initialData: false,
    staleTime: Infinity,
  });

  const favorites = useMemo(() => {
    if (isFavoritesHidden || !data?.pages) return [];
    const flat = data.pages.flat();
    const seen = new Set();
    return flat.filter((item) => {
      const key = item?.destinationId || item?.id;
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [isFavoritesHidden, data]);

  const loadNextPage = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const loading = isLoading && favorites.length === 0;
  const isShowingSkeleton = loading;

  return {
    searchQuery,
    setSearchQuery,
    normalizedSearch,
    flatListRef,
    scrollY,
    handleClearSearch,
    favorites,
    loading,
    isShowingSkeleton,
    isRefetching,
    refetch,
    loadNextPage,
    isFetchingNextPage,
  };
}

export default useFavoritesList;
