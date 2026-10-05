import React, { useState, useCallback, useRef, useEffect, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  ImageBackground,
  Modal,
  TextInput,
  Animated,
  Keyboard,
  StyleSheet,
  Easing,
  Platform,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Feather from "react-native-vector-icons/Feather";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useInfiniteQuery } from "@tanstack/react-query";
import styles from "../home.styles";
import { SearchSkeletonList, SearchCardSkeleton } from "../../../shared/components/Skeleton";
import FadeInView from "../../../shared/components/FadeInView";
import SearchCardItem from "./SearchCardItem";
import CountryFilterModal from "./CountryFilterModal";
import CategoryFilterModal from "./CategoryFilterModal";
import { getDestinations } from "../../destinations/api/destinationService";

const SCREEN_HEIGHT = Dimensions.get("screen").height;

export default function SearchModal({
  visible,
  onClose,
  initialCategory = null,
  categories = [],
  currentTheme,
  isDarkMode,
  navigation,
  bgSource,
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

  const searchFocusAnim = useRef(new Animated.Value(0)).current;
  const searchInputRef = useRef(null);
  const searchSlideAnim = useRef(new Animated.Value(-SCREEN_HEIGHT)).current;
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
      setSelectedCategory(initialCategory || null);
      setSearchQuery("");
      setDebouncedSearch("");
      setAlphaSort(null);
      setPriceSort(null);
      setRatingSort(null);
      setSelectedCountry(null);
    }
  }, [visible, initialCategory]);

  const SEARCH_PAGE_SIZE = 12;
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
  } = useInfiniteQuery({
    queryKey: [
      "destinations",
      "searchModal",
      activeCategoryParam,
      normalizedSearch,
      activeSortBy,
    ],
    enabled: visible,
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
    (isQueryLoading || (isFetching && !isFetchingNextPage && apiDestinations.length === 0)) &&
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
      searchSlideAnim.setValue(-SCREEN_HEIGHT);
      searchFadeAnim.setValue(0);

      Animated.sequence([
        Animated.timing(searchFadeAnim, {
          toValue: 1,
          duration: 140,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.spring(searchSlideAnim, {
          toValue: 0,
          damping: 24,
          stiffness: 220,
          mass: 0.8,
          useNativeDriver: true,
        }),
      ]).start();

      const focusTimer = setTimeout(() => {
        if (!isClosingSearch.current) {
          searchInputRef.current?.focus();
        }
      }, 260);

      return () => clearTimeout(focusTimer);
    }
  }, [visible, searchSlideAnim, searchFadeAnim]);

  const handleCloseSearch = useCallback(() => {
    if (isClosingSearch.current) return;
    isClosingSearch.current = true;

    searchInputRef.current?.blur();
    setIsSearchFocused(false);
    searchFocusAnim.setValue(0);

    const keyboardWasOpen = isKeyboardVisible.current;
    Keyboard.dismiss();

    let finishedAnim = false;
    let finishedKeyboard = !keyboardWasOpen;

    const finalizeClose = () => {
      if (finishedAnim && finishedKeyboard) {
        if (hideListener) {
          hideListener.remove();
          hideListener = null;
        }
        if (fallbackTimeout) {
          clearTimeout(fallbackTimeout);
          fallbackTimeout = null;
        }
        setIsFilterVisible(false);
        filterAnim.setValue(0);
        isClosingSearch.current = false;
        onClose();
      }
    };

    let hideListener = null;
    let fallbackTimeout = null;

    if (keyboardWasOpen) {
      hideListener = Keyboard.addListener(
        Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
        () => {
          hideListener?.remove();
          hideListener = null;
          if (fallbackTimeout) clearTimeout(fallbackTimeout);
          finishedKeyboard = true;
          finalizeClose();
        }
      );

      fallbackTimeout = setTimeout(() => {
        hideListener?.remove();
        hideListener = null;
        finishedKeyboard = true;
        finalizeClose();
      }, 300);
    }

    Animated.parallel([
      Animated.timing(searchSlideAnim, {
        toValue: -SCREEN_HEIGHT,
        duration: 280,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        useNativeDriver: true,
      }),
      Animated.timing(searchFadeAnim, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start(() => {
      finishedAnim = true;
      finalizeClose();
    });
  }, [searchSlideAnim, searchFadeAnim, searchFocusAnim, onClose]);

  const windowHeight = Dimensions.get("window").height;
  const baseSearchHeight = Math.max(500, windowHeight - 150);
  const searchCardSlot = Math.floor(baseSearchHeight / 6);
  const searchCardHeight = Math.max(72, searchCardSlot - 10);
  const searchCardMarginBottom = Math.max(8, searchCardSlot - searchCardHeight);

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

  const resolvedBgSource = useMemo(() => {
    if (bgSource) return bgSource;
    if (currentTheme?.bg) {
      return typeof currentTheme.bg === "string" ? { uri: currentTheme.bg } : currentTheme.bg;
    }
    return null;
  }, [bgSource, currentTheme?.bg]);

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      animationType="none"
      transparent={true}
      statusBarTranslucent={true}
      navigationBarTranslucent={true}
      onRequestClose={handleCloseSearch}
    >
      <View style={styles.transparentFlex}>
        <Animated.View
          style={[
            StyleSheet.absoluteFillObject,
            { opacity: searchFadeAnim }
          ]}
          pointerEvents="none"
        >
          <ImageBackground
            source={resolvedBgSource}
            blurRadius={10}
            style={styles.screenCover}
            resizeMode="cover"
          >
            <LinearGradient
              colors={["rgba(0, 0, 0, 0.55)", "transparent", "rgba(0, 0, 0, 0.75)"]}
              locations={[0, 0.45, 1]}
              style={styles.screenCover}
            />
            <View
              style={!isDarkMode ? styles.screenCoverLight : styles.screenCoverDark}
            />
          </ImageBackground>
        </Animated.View>

        <StatusBar barStyle="light-content" translucent={true} backgroundColor="transparent" />
        <Animated.View
          style={[
            styles.flex1,
            {
              opacity: searchFadeAnim,
              transform: [{ translateY: searchSlideAnim }],
            },
          ]}
        >
          <SafeAreaView style={styles.searchContainer}>
            <View style={styles.searchHeaderRow}>
              <TouchableOpacity onPress={toggleFilter} style={styles.searchBackBtn}>
                <Animated.View style={[{ transform: [{ rotate: filterIconRotate }, { scale: filterIconScale }] }]}>
                  <Feather name="sliders" size={24} color={isFilterVisible ? currentTheme.accent : "#FFF"} />
                </Animated.View>
              </TouchableOpacity>
              <Animated.View
                style={[
                  styles.searchInputBox,
                  {
                    flexDirection: "row",
                    alignItems: "center",
                    borderColor: searchFocusAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ["transparent", currentTheme.accent],
                    }),
                    backgroundColor: searchFocusAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: !isDarkMode
                        ? ["rgba(100, 100, 100, 0.82)", "rgba(100, 100, 100, 1)"]
                        : ["rgba(20, 20, 20, 0.75)", "rgba(10, 10, 10, 0.85)"],
                    }),
                  },
                ]}
              >
                <TextInput
                  ref={searchInputRef}
                  underlineColorAndroid="transparent"
                  style={styles.searchInput}
                  placeholder="Pesquisar destinos..."
                  placeholderTextColor={
                    !isDarkMode
                      ? "rgba(255, 255, 255, 0.65)"
                      : isSearchFocused
                        ? "rgba(255, 255, 255, 0.65)"
                        : "#FFF"
                  }
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  onFocus={handleSearchFocus}
                  onBlur={handleSearchBlur}
                />
                {isSearching ? (
                  <ActivityIndicator
                    size="small"
                    color={currentTheme?.accent || "#FFF"}
                    style={{ marginRight: 10 }}
                  />
                ) : null}
                {searchQuery.length > 0 && !isSearching ? (
                  <TouchableOpacity
                    onPress={() => setSearchQuery("")}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    style={{ marginRight: 10 }}
                  >
                    <Ionicons
                      name="close-circle"
                      size={18}
                      color={isDarkMode ? "rgba(255, 255, 255, 0.65)" : "#FFF"}
                    />
                  </TouchableOpacity>
                ) : null}
              </Animated.View>
              <TouchableOpacity onPress={handleCloseSearch} style={styles.marginLeft15}>
                <Feather name="x" size={24} color="#FFF" />
              </TouchableOpacity>
            </View>

            <Animated.View style={[{ height: filterAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 50] }), marginBottom: filterAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 15] }), opacity: filterAnim.interpolate({ inputRange: [0, 0.2, 1], outputRange: [0, 0.4, 1] }), transform: [{ translateY: filterAnim.interpolate({ inputRange: [0, 1], outputRange: [-14, 0] }) }], overflow: "hidden" }]}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                onScrollBeginDrag={dismissSearchFocus}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={styles.filterCategoriesContent}
                style={styles.searchFilterRow}
              >
                <TouchableOpacity
                  onPress={() => {
                    dismissSearchFocus();
                    setIsCategoryModalVisible(true);
                  }}
                  activeOpacity={0.75}
                  style={[
                    styles.filterBtnBase,
                    selectedCategory ? { backgroundColor: currentTheme.accent } : styles.filterBtnInactive,
                  ]}
                >
                  <Feather
                    name="grid"
                    size={14}
                    color={selectedCategory ? "#000" : "#FFF"}
                    style={styles.marginRight6}
                  />
                  <Text style={selectedCategory ? styles.filterBtnActiveText : styles.filterBtnInactiveText}>
                    {selectedCategoryName || "Categorias"}
                  </Text>
                  {selectedCategory ? (
                    <TouchableOpacity
                      onPress={(e) => {
                        e.stopPropagation();
                        setSelectedCategory(null);
                      }}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      style={styles.marginLeft6}
                    >
                      <Feather name="x" size={14} color="#000" />
                    </TouchableOpacity>
                  ) : null}
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    dismissSearchFocus();
                    setPriceSort(null);
                    setRatingSort(null);
                    if (alphaSort === null) setAlphaSort("asc");
                    else if (alphaSort === "asc") setAlphaSort("desc");
                    else setAlphaSort(null);
                  }}
                  activeOpacity={0.75}
                  style={[styles.filterBtnBase, alphaSort ? { backgroundColor: currentTheme.accent } : styles.filterBtnInactive]}
                >
                  <Text style={alphaSort ? styles.filterBtnActiveText : styles.filterBtnInactiveText}>
                    {alphaSort === "asc" ? "A-Z ↓" : alphaSort === "desc" ? "Z-A ↑" : "A-Z ⇅"}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    dismissSearchFocus();
                    setIsCountryModalVisible(true);
                  }}
                  activeOpacity={0.75}
                  style={[styles.filterBtnBase, selectedCountry ? { backgroundColor: currentTheme.accent } : styles.filterBtnInactive]}
                >
                  <Feather
                    name="globe"
                    size={14}
                    color={selectedCountry ? "#000" : "#FFF"}
                    style={styles.marginRight6}
                  />
                  <Text style={selectedCountry ? styles.filterBtnActiveText : styles.filterBtnInactiveText}>
                    {selectedCountry || "Países"}
                  </Text>
                  {selectedCountry ? (
                    <TouchableOpacity
                      onPress={(e) => {
                        e.stopPropagation();
                        setSelectedCountry(null);
                      }}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      style={styles.marginLeft6}
                    >
                      <Feather name="x" size={14} color="#000" />
                    </TouchableOpacity>
                  ) : null}
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    dismissSearchFocus();
                    setAlphaSort(null);
                    setRatingSort(null);
                    if (priceSort === null) setPriceSort("asc");
                    else if (priceSort === "asc") setPriceSort("desc");
                    else setPriceSort(null);
                  }}
                  activeOpacity={0.75}
                  style={[styles.filterBtnBase, priceSort ? { backgroundColor: currentTheme.accent } : styles.filterBtnInactive]}
                >
                  <Text style={priceSort ? styles.filterBtnActiveText : styles.filterBtnInactiveText}>
                    {priceSort === "asc" ? "Preço ↑" : priceSort === "desc" ? "Preço ↓" : "Preço ↑↓"}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    dismissSearchFocus();
                    setAlphaSort(null);
                    setPriceSort(null);
                    if (ratingSort === null) setRatingSort("desc");
                    else if (ratingSort === "desc") setRatingSort("asc");
                    else setRatingSort(null);
                  }}
                  activeOpacity={0.75}
                  style={[styles.filterBtnBase, styles.marginRight20, ratingSort ? { backgroundColor: currentTheme.accent } : styles.filterBtnInactive]}
                >
                  <Ionicons
                    name="star"
                    size={13}
                    color={ratingSort ? "#000" : "#FFF"}
                    style={styles.marginRight6}
                  />
                  <Text style={ratingSort ? styles.filterBtnActiveText : styles.filterBtnInactiveText}>
                    {ratingSort === "desc" ? "Avaliações ↓" : ratingSort === "asc" ? "Avaliações ↑" : "Avaliações ↑↓"}
                  </Text>
                </TouchableOpacity>
              </ScrollView>
            </Animated.View>

            {isSearchLoading ? (
              <SearchSkeletonList
                isDarkMode={isDarkMode}
                cardHeight={searchCardHeight}
                cardMarginBottom={searchCardMarginBottom}
                count={6}
              />
            ) : (
              <FadeInView duration={240} style={styles.searchListWrapper}>
                <Animated.FlatList
                  ref={searchFlatListRef}
                  data={filteredData}
                  extraData={[alphaSort, priceSort, ratingSort, selectedCountry, selectedCategory, currentTheme, isDarkMode]}
                  keyExtractor={(item, index) => (item?.id ? String(item.id) : String(index))}
                  showsVerticalScrollIndicator={false}
                  removeClippedSubviews={false}
                  initialNumToRender={12}
                  maxToRenderPerBatch={12}
                  windowSize={10}
                  onScrollBeginDrag={dismissSearchFocus}
                  keyboardDismissMode="on-drag"
                  keyboardShouldPersistTaps="handled"
                  scrollEventThrottle={16}
                  onEndReached={loadNextSearchPage}
                  onEndReachedThreshold={0.5}
                  onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: searchScrollY } } }],
                    { useNativeDriver: true }
                  )}
                  style={styles.flex1}
                  contentContainerStyle={{
                    paddingHorizontal: 20,
                    paddingTop: 6,
                    paddingBottom: 24,
                  }}
                  bounces={true}
                  overScrollMode="always"
                  renderItem={({ item }) => (
                    <SearchCardItem
                      item={item}
                      cardHeight={searchCardHeight}
                      cardMarginBottom={searchCardMarginBottom}
                      currentTheme={currentTheme}
                      isDarkMode={isDarkMode}
                      isOverlayActive={isCountryModalVisible || isCategoryModalVisible}
                      showPrice={Boolean(priceSort)}
                      showRating={Boolean(ratingSort)}
                      onPress={() => {
                        isClosingSearch.current = false;
                        Keyboard.dismiss();
                        onClose();
                        navigation.navigate("Details", { item, currentTheme });
                      }}
                    />
                  )}
                  ListFooterComponent={
                    isFetchingNextPage ? (
                      <View style={{ paddingTop: 6 }}>
                        <SearchCardSkeleton
                          cardHeight={searchCardHeight}
                          cardMarginBottom={searchCardMarginBottom}
                          isDarkMode={isDarkMode}
                        />
                        <SearchCardSkeleton
                          cardHeight={searchCardHeight}
                          cardMarginBottom={searchCardMarginBottom}
                          isDarkMode={isDarkMode}
                        />
                      </View>
                    ) : null
                  }
                  ListEmptyComponent={
                    <View style={styles.searchEmptyContainer}>
                      <Text style={styles.whiteText}>
                        {normalizedSearch.length > 0
                          ? `Nenhum destino encontrado para "${normalizedSearch}".`
                          : "Nenhum destino encontrado."}
                      </Text>
                    </View>
                  }
                />
              </FadeInView>
            )}
          </SafeAreaView>
        </Animated.View>

        <CountryFilterModal
          visible={isCountryModalVisible}
          onClose={() => setIsCountryModalVisible(false)}
          destinations={apiDestinations}
          selectedCountry={selectedCountry}
          onSelectCountry={setSelectedCountry}
          currentTheme={currentTheme}
          isDarkMode={isDarkMode}
        />

        <CategoryFilterModal
          visible={isCategoryModalVisible}
          onClose={() => setIsCategoryModalVisible(false)}
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          currentTheme={currentTheme}
          isDarkMode={isDarkMode}
        />
      </View>
    </Modal>
  );
}
