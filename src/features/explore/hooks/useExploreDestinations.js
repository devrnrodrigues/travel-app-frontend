import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getDestinations } from "../../../shared/api/destinationApi";

const PAGE_SIZE = 24;

export function useExploreDestinations() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 350);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const normalizedSearch = debouncedSearch.trim();

  const {
    data,
    isLoading,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
    isRefetching,
    isError,
    error,
  } = useInfiniteQuery({
    queryKey: ["destinations", "explore", normalizedSearch],
    queryFn: ({ pageParam = 0 }) =>
      getDestinations({
        name: normalizedSearch || undefined,
        page: pageParam,
        size: PAGE_SIZE,
      }),
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

  const loading = (isLoading || (isFetching && !isFetchingNextPage && destinations.length === 0)) && destinations.length === 0;
  const isShowingSkeleton = loading && !isError;
  const loadingMore = isFetchingNextPage;
  const isLoadingMoreRef = useRef(false);
  isLoadingMoreRef.current = isFetchingNextPage;
  const refreshing = isRefetching;
  const isSearching = (isFetching && !isFetchingNextPage && !refreshing) || searchQuery !== debouncedSearch;

  const loadNextPage = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  return {
    searchQuery,
    setSearchQuery,
    normalizedSearch,
    destinations,
    loading,
    isShowingSkeleton,
    loadingMore,
    isLoadingMoreRef,
    refreshing,
    isSearching,
    loadNextPage,
    handleRefresh,
    isError: isError && destinations.length === 0,
    error,
  };
}

export default useExploreDestinations;
