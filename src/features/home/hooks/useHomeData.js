import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { getDestinations } from "../../../shared/api/destinationApi";

const PAGE_SIZE = 6;
const TOP_PAGE_SIZE = 6;

export default function useHomeData(selectedCategory) {
  const queryClient = useQueryClient();
  const flatListRef = useRef(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    flatListRef.current?.scrollToOffset({ offset: 0, animated: false });
  }, [selectedCategory]);

  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
    isRefetching,
  } = useInfiniteQuery({
    queryKey: ["destinations", "home", selectedCategory],
    enabled: Boolean(selectedCategory),
    queryFn: async ({ pageParam = 0 }) => {
      const result = await getDestinations({
        category: selectedCategory,
        page: pageParam,
        size: PAGE_SIZE,
      });
      return (result || []).map((destination) => ({
        ...destination,
        isLocalSource: false,
      }));
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      if (!lastPage || lastPage.length < PAGE_SIZE) {
        return undefined;
      }
      return lastPageParam + 1;
    },
  });

  const destinations = useMemo(() => {
    if (!data?.pages) return [];
    const flat = data.pages.flat();
    const seen = new Set();
    return flat.filter((item) => {
      const key = item?.id;
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [data]);

  const isFetchingNextPageRef = useRef(false);
  useEffect(() => {
    isFetchingNextPageRef.current = isFetchingNextPage;
  }, [isFetchingNextPage]);

  const loadNextPage = useCallback(async () => {
    if (hasNextPage && !isFetchingNextPage && !isFetchingNextPageRef.current) {
      isFetchingNextPageRef.current = true;
      try {
        await fetchNextPage({ cancelRefetch: false });
      } finally {
        isFetchingNextPageRef.current = false;
      }
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const {
    data: topDestinationsData,
    isLoading: loadingTopDestinations,
    isFetchingNextPage: isFetchingNextTopPage,
    hasNextPage: hasNextTopPage,
    fetchNextPage: fetchNextTopPage,
    refetch: refetchTopDestinations,
  } = useInfiniteQuery({
    queryKey: ["destinations", "recommendations"],
    queryFn: async ({ pageParam = 0 }) => {
      const result = await getDestinations({
        page: pageParam,
        size: TOP_PAGE_SIZE,
      });
      return (result || []).map((destination) => ({
        ...destination,
        isLocalSource: false,
      }));
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      if (!lastPage || lastPage.length < TOP_PAGE_SIZE) {
        return undefined;
      }
      return lastPageParam + 1;
    },
    staleTime: 1000 * 60 * 5,
  });

  const topDestinations = useMemo(() => {
    if (!topDestinationsData?.pages) return [];
    const flat = topDestinationsData.pages.flat();
    const seen = new Set();
    return flat.filter((item) => {
      const key = item?.id;
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [topDestinationsData]);

  const isFetchingNextTopPageRef = useRef(false);
  useEffect(() => {
    isFetchingNextTopPageRef.current = isFetchingNextTopPage;
  }, [isFetchingNextTopPage]);

  const loadNextTopPage = useCallback(async () => {
    if (hasNextTopPage && !isFetchingNextTopPage && !isFetchingNextTopPageRef.current) {
      isFetchingNextTopPageRef.current = true;
      try {
        await fetchNextTopPage({ cancelRefetch: false });
      } finally {
        isFetchingNextTopPageRef.current = false;
      }
    }
  }, [hasNextTopPage, isFetchingNextTopPage, fetchNextTopPage]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        refetch(),
        refetchTopDestinations(),
        queryClient.invalidateQueries({ queryKey: ["categories"] }),
      ]);
    } catch (e) {
      console.error(e);
    } finally {
      setRefreshing(false);
    }
  }, [refetch, refetchTopDestinations, queryClient]);

  const isShowingSkeleton = isLoading && destinations.length === 0;
  const isShowingTopSkeleton = loadingTopDestinations && topDestinations.length === 0;

  return {
    flatListRef,
    destinations,
    topDestinations,
    isShowingSkeleton,
    isShowingTopSkeleton,
    isFetchingNextPage,
    isFetchingNextTopPage,
    refreshing: refreshing || isRefetching,
    loadNextPage,
    loadNextTopPage,
    handleRefresh,
  };
}
