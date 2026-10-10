import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { Animated, Keyboard, Easing, Platform, Dimensions } from "react-native";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getDestinations } from "../../../shared/api/destinationApi";

const SEARCH_PAGE_SIZE = 12;
const ENTRANCE_OFFSET = -35;

export default function useSearchModal({
  visible,
  onClose,
  initialCategory = null,
  categories = [],
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || null);
  const [alphaSort, setAlphaSort] = useState(null);
  const [priceSort, setPriceSort] = useState(null);
  const [ratingSort, setRatingSort] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [isCountryModalVisible, setIsCountryModalVisible] = useState(false);
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isReadyToFetch, setIsReadyToFetch] = useState(false);

  const searchFocusAnim = useRef(new Animated.Value(0)).current;
  const searchInputRef = useRef(null);
  const searchSlideAnim = useRef(new Animated.Value(ENTRANCE_OFFSET)).current;
  const searchFadeAnim = useRef(new Animated.Value(0)).current;
  const filterAnim = useRef(new Animated.Value(0)).current;
  const searchScrollY = useRef(new Animated.Value(0)).current;
  const searchFlatListRef = useRef(null);
  const isClosingSearch = useRef(false);
  const isKeyboardVisible = useRef(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 350);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const normalizedSearch = debouncedSearch.trim();

  const activeSortBy = useMemo(() => {
    if (alphaSort === "asc") return "name_asc";
    if (alphaSort === "desc") return "name_desc";
    if (ratingSort === "desc") return "rating_desc";
    if (ratingSort === "asc") return "rating_asc";
    if (priceSort === "asc") return "price_asc";
    if (priceSort === "desc") return "price_desc";
    return undefined;
  }, [alphaSort, ratingSort, priceSort]);

  useEffect(() => {
    if (visible) {
      setSelectedCategory((prev) => (prev !== (initialCategory || null) ? (initialCategory || null) : prev));
      setSearchQuery((prev) => (prev !== "" ? "" : prev));
      setDebouncedSearch((prev) => (prev !== "" ? "" : prev));
      setAlphaSort((prev) => (prev !== null ? null : prev));
      setPriceSort((prev) => (prev !== null ? null : prev));
      setRatingSort((prev) => (prev !== null ? null : prev));
      setSelectedCountry((prev) => (prev !== null ? null : prev));
    } else {
      setIsReadyToFetch(false);
    }
  }, [visible, initialCategory]);

  const activeCategoryParam =
    selectedCategory && selectedCategory !== "all" && selectedCategory !== "todas"
      ? selectedCategory
      : undefined;

  const {
    data,
    isLoading: isQueryLoading,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    isError,
    error,
    refetch,
  } = useInfiniteQuery({
    queryKey: [
      "destinations",
      "searchModal",
      activeCategoryParam,
      normalizedSearch,
      activeSortBy,
    ],
    enabled: Boolean(visible && isReadyToFetch),
    queryFn: ({ pageParam = 0 }) =>
      getDestinations({
        category: activeCategoryParam,
        name: normalizedSearch || undefined,
        sortBy: activeSortBy,
        page: pageParam,
        size: SEARCH_PAGE_SIZE,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      if (!lastPage || lastPage.length < SEARCH_PAGE_SIZE) {
        return undefined;
      }
      return lastPageParam + 1;
    },
  });

  const apiDestinations = useMemo(() => {
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

  const selectedCategoryName = useMemo(() => {
    if (!selectedCategory) return null;
    const found = categories.find(
      (c) =>
        (c.slug && c.slug.toLowerCase() === selectedCategory.toLowerCase()) ||
        (c.name && c.name.toLowerCase() === selectedCategory.toLowerCase())
    );
    return found?.name || found?.title || selectedCategory;
  }, [categories, selectedCategory]);

  const isSearching = (isFetching && !isFetchingNextPage) || searchQuery !== debouncedSearch;
  const isSearchLoading =
    (!isReadyToFetch || isQueryLoading || (isFetching && !isFetchingNextPage && apiDestinations.length === 0)) &&
    apiDestinations.length === 0;

  const loadNextSearchPage = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const filterIconRotate = filterAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "90deg"],
  });

  const filterIconScale = filterAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 0.85, 1],
  });

  const handleSearchFocus = useCallback(() => {
    setIsSearchFocused(true);
    Animated.timing(searchFocusAnim, {
      toValue: 1,
      duration: 200,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();
  }, [searchFocusAnim]);

  const handleSearchBlur = useCallback(() => {
    setIsSearchFocused(false);
    Animated.timing(searchFocusAnim, {
      toValue: 0,
      duration: 200,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();
  }, [searchFocusAnim]);

  const dismissSearchFocus = useCallback(() => {
    Keyboard.dismiss();
    searchInputRef.current?.blur();
    handleSearchBlur();
  }, [handleSearchBlur]);

  const toggleFilter = useCallback(() => {
    dismissSearchFocus();
    if (isFilterVisible) {
      Animated.timing(filterAnim, {
        toValue: 0,
        duration: 200,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        useNativeDriver: false,
      }).start(() => {
        setIsFilterVisible(false);
      });
    } else {
      setIsFilterVisible(true);
      filterAnim.setValue(0);
      Animated.spring(filterAnim, {
        toValue: 1,
        damping: 20,
        stiffness: 220,
        mass: 0.8,
        useNativeDriver: false,
      }).start();
    }
  }, [isFilterVisible, filterAnim, dismissSearchFocus]);

  useEffect(() => {
    const onShow = () => {
      isKeyboardVisible.current = true;
    };
    const onHide = () => {
      isKeyboardVisible.current = false;
      if (!isClosingSearch.current) {
        searchInputRef.current?.blur();
        handleSearchBlur();
      }
    };

    const willShowSub = Keyboard.addListener("keyboardWillShow", onShow);
    const didShowSub = Keyboard.addListener("keyboardDidShow", onShow);
    const willHideSub = Keyboard.addListener("keyboardWillHide", onHide);
    const didHideSub = Keyboard.addListener("keyboardDidHide", onHide);

    return () => {
      willShowSub.remove();
      didShowSub.remove();
      willHideSub.remove();
      didHideSub.remove();
    };
  }, [handleSearchBlur]);

  useEffect(() => {
    if (visible) {
      isClosingSearch.current = false;
      searchSlideAnim.setValue(ENTRANCE_OFFSET);
      searchFadeAnim.setValue(0);

      Animated.parallel([
        Animated.timing(searchFadeAnim, {
          toValue: 1,
          duration: 180,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.spring(searchSlideAnim, {
          toValue: 0,
          damping: 24,
          stiffness: 240,
          mass: 0.8,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setIsReadyToFetch(true);
      });

      const focusTimer = setTimeout(() => {
        if (!isClosingSearch.current) {
          searchInputRef.current?.focus();
        }
      }, 240);

      return () => clearTimeout(focusTimer);
    }
  }, [visible, searchSlideAnim, searchFadeAnim]);

  const handleCloseSearch = useCallback(() => {
    if (isClosingSearch.current) return;
    isClosingSearch.current = true;

    searchInputRef.current?.blur();
    setIsSearchFocused(false);
    searchFocusAnim.setValue(0);

    Keyboard.dismiss();

    const finalizeClose = () => {
      setIsFilterVisible(false);
      filterAnim.setValue(0);
      isClosingSearch.current = false;
      onClose();
    };

    Animated.parallel([
      Animated.timing(searchSlideAnim, {
        toValue: ENTRANCE_OFFSET,
        duration: 180,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(searchFadeAnim, {
        toValue: 0,
        duration: 180,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(() => {
      finalizeClose();
    });
  }, [searchSlideAnim, searchFadeAnim, searchFocusAnim, filterAnim, onClose]);

  useEffect(() => {
    searchScrollY.setValue(0);
    searchFlatListRef.current?.scrollToOffset({ offset: 0, animated: false });
  }, [visible, normalizedSearch, selectedCategory, activeSortBy, selectedCountry]);

  const filteredData = useMemo(() => {
    if (!selectedCountry) return apiDestinations;
    return apiDestinations.filter((item) =>
      item.location && item.location.toLowerCase().includes(selectedCountry.toLowerCase())
    );
  }, [apiDestinations, selectedCountry]);

  return {
    searchQuery,
    setSearchQuery,
    normalizedSearch,
    selectedCategory,
    setSelectedCategory,
    selectedCategoryName,
    alphaSort,
    setAlphaSort,
    priceSort,
    setPriceSort,
    ratingSort,
    setRatingSort,
    selectedCountry,
    setSelectedCountry,
    isCountryModalVisible,
    setIsCountryModalVisible,
    isCategoryModalVisible,
    setIsCategoryModalVisible,
    isFilterVisible,
    isSearchFocused,
    searchFocusAnim,
    searchInputRef,
    searchSlideAnim,
    searchFadeAnim,
    filterAnim,
    searchScrollY,
    searchFlatListRef,
    isClosingSearch,
    apiDestinations,
    filteredData,
    isSearching,
    isSearchLoading,
    isFetchingNextPage,
    loadNextSearchPage,
    filterIconRotate,
    filterIconScale,
    handleSearchFocus,
    handleSearchBlur,
    dismissSearchFocus,
    toggleFilter,
    handleCloseSearch,
    isError: isError && apiDestinations.length === 0,
    error,
    refetch,
  };
}
