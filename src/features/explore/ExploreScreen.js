import React, { useState, useCallback, useRef, useMemo, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
  ScrollView,
  Image,
  ActivityIndicator,
  RefreshControl,
  StatusBar,
  ImageBackground,
  Animated,
  Keyboard,
  Platform,
  FlatList,
  Easing,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Feather from "react-native-vector-icons/Feather";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useTheme } from "../../theme/ThemeContext";
import { ExploreSkeletonGrid } from "../../shared/components/Skeleton";
import FadeInView from "../../shared/components/FadeInView";
import styles, { GAP, COLUMN_WIDTH, CARD_HEIGHT, categoryThemes, defaultTheme } from "./explore.styles";
import { getDestinations } from "../destinations/api/destinationService";
import { getOptimizedImageUrl } from "../../shared/utils/imageUrl";

const ExploreCard = React.memo(function ExploreCard({ item, onPress, isDarkMode }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const imgAnim = useRef(new Animated.Value(0)).current;

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
    Animated.timing(imgAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: Platform.OS !== "web",
    }).start();
  }, [imgAnim]);

  const handlePress = useCallback(() => {
    if (onPress) {
      onPress(item);
    }
  }, [onPress, item]);

  const reviewCount = Number(
    item?.reviewCount ??
    item?.reviewsCount ??
    (Array.isArray(item?.reviews) ? item.reviews.length : 0)
  );
  const hasReviews = reviewCount >= 1;
  const ratingValue =
    item?.realRating && item.realRating !== "0.0"
      ? item.realRating
      : item?.rating != null && Number(item.rating) > 0
      ? Number(item.rating).toFixed(1)
      : null;

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      style={[
        styles.gridItem,
        { width: COLUMN_WIDTH, height: CARD_HEIGHT },
        !isDarkMode && styles.gridItemLight,
        item.avgColor ? { backgroundColor: item.avgColor } : null,
      ]}
      onPress={handlePress}
    >
      {item.image_url ? (
        <>
          <Animated.Image
            source={{ uri: getOptimizedImageUrl(item.image_url, 350) }}
            style={[styles.gridImage, { opacity: imgAnim }]}
            resizeMode="cover"
            onLoad={handleImageLoad}
            accessibilityLabel={item.alt || item.name || item.title}
          />
          {!imageLoaded && (
            <View style={[styles.imageSkeletonOverlay, isDarkMode ? styles.imageSkeletonDark : styles.imageSkeletonLight, item.avgColor ? { backgroundColor: item.avgColor } : null]} />
          )}
        </>
      ) : (
        <View
          style={[
            styles.gridImage,
            {
              backgroundColor: isDarkMode ? "#1A1A1A" : "#262626",
              justifyContent: "center",
              alignItems: "center",
              paddingHorizontal: 8,
            },
          ]}
        >
          <Ionicons name="image-outline" size={32} color="rgba(255, 255, 255, 0.35)" />
          <Text
            style={{
              color: "rgba(255, 255, 255, 0.6)",
              fontSize: 11,
              textAlign: "center",
              marginTop: 6,
              fontWeight: "500",
            }}
          >
            Sem imagens disponível.
          </Text>
        </View>
      )}

      {hasReviews && ratingValue ? (
        <View style={styles.topBadge}>
          <Ionicons name="star" size={9.5} color="#FFD700" />
          <Text style={styles.topBadgeText}>{ratingValue}</Text>
        </View>
      ) : null}

      <LinearGradient
        colors={["transparent", "rgba(0, 0, 0, 0.86)"]}
        style={styles.bottomOverlay}
      >
        <Text style={styles.destinationTitle} numberOfLines={2}>
          {item.title}
        </Text>
        {item.location ? (
          <View style={styles.badgeRow}>
            <Feather
              name="map-pin"
              size={8.5}
              color="rgba(255, 255, 255, 0.75)"
              style={styles.badgeIconMargin}
            />
            <Text style={styles.destinationLocation} numberOfLines={1}>
              {item.location}
            </Text>
          </View>
        ) : null}
      </LinearGradient>
    </TouchableOpacity>
  );
});

export default function Explore({ navigation }) {
  const { currentTheme, isDarkMode } = useTheme();
  const bgSource = typeof currentTheme?.bg === "string" ? { uri: currentTheme.bg } : currentTheme?.bg;
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchInputRef = useRef(null);

  const PAGE_SIZE = 24;

  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
    isRefetching,
  } = useInfiniteQuery({
    queryKey: ["destinations", "explore"],
    queryFn: ({ pageParam = 0 }) => getDestinations({ page: pageParam, size: PAGE_SIZE }),
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

  const loading = isLoading && destinations.length === 0;
  const loadingMore = isFetchingNextPage;
  const isLoadingMoreRef = useRef(false);
  isLoadingMoreRef.current = isFetchingNextPage;
  const refreshing = isRefetching;

  const insets = useSafeAreaInsets();
  const topInset = Math.max(insets.top, Platform.OS === "android" ? 38 : 20);
  const headerHeight = (insets.top > 0 ? insets.top + 4 : (Platform.OS === "android" ? 34 : 10)) + 46;
  const bottomPadding = (insets.bottom || 0) + 85;

  const dismissSearchFocus = useCallback(() => {
    Keyboard.dismiss();
    searchInputRef.current?.blur();
    setIsSearchFocused(false);
  }, []);

  const searchBarAnim = useRef(new Animated.Value(0)).current;
  const [isSearchBarVisible, setIsSearchBarVisible] = useState(true);
  const isSearchBarVisibleRef = useRef(true);
  const lastScrollY = useRef(0);
  const isSearchFocusedRef = useRef(false);

  const hideSearchBar = useCallback(() => {
    if (isSearchFocusedRef.current || !isSearchBarVisibleRef.current) return;
    if (lastScrollY.current <= 20) return;
    isSearchBarVisibleRef.current = false;
    setIsSearchBarVisible(false);
    Animated.timing(searchBarAnim, {
      toValue: 1,
      duration: 140,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, [searchBarAnim]);

  const showSearchBar = useCallback(() => {
    if (!isSearchBarVisibleRef.current) {
      isSearchBarVisibleRef.current = true;
      setIsSearchBarVisible(true);
      Animated.timing(searchBarAnim, {
        toValue: 0,
        duration: 140,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }).start();
    }
  }, [searchBarAnim]);

  useEffect(() => {
    isSearchFocusedRef.current = isSearchFocused;
    if (isSearchFocused) {
      showSearchBar();
    }
  }, [isSearchFocused, showSearchBar]);

  useEffect(() => {
    const handleKeyboardHide = () => {
      searchInputRef.current?.blur();
      setIsSearchFocused(false);
    };
    const didHideSub = Keyboard.addListener("keyboardDidHide", handleKeyboardHide);
    const willHideSub = Keyboard.addListener("keyboardWillHide", handleKeyboardHide);
    return () => {
      didHideSub.remove();
      willHideSub.remove();
    };
  }, []);

  const loadNextPage = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleScroll = useCallback((event) => {
    if (isLoadingMoreRef.current) return;
    const { nativeEvent } = event;
    const currentY = nativeEvent.contentOffset.y;
    const diff = currentY - lastScrollY.current;

    if (currentY <= 20) {
      if (!isSearchBarVisibleRef.current) {
        showSearchBar();
      }
    } else if (diff > 12 && currentY > 60) {
      if (!isSearchFocusedRef.current && isSearchBarVisibleRef.current) {
        hideSearchBar();
      }
    } else if (diff < -15) {
      if (!isSearchBarVisibleRef.current) {
        showSearchBar();
      }
    }

    lastScrollY.current = currentY;
  }, [hideSearchBar, showSearchBar]);

  const searchTranslateY = searchBarAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -headerHeight],
  });

  const searchOpacity = searchBarAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });

  useFocusEffect(
    useCallback(() => {
      showSearchBar();
      return () => {
        dismissSearchFocus();
      };
    }, [showSearchBar, dismissSearchFocus])
  );

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const filteredDestinations = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (query === "") return destinations;

    return destinations.filter((item) => (
      item.title?.toLowerCase().includes(query) ||
      item.location?.toLowerCase().includes(query) ||
      item.category?.toLowerCase().includes(query)
    ));
  }, [destinations, searchQuery]);



  const handleCardPress = useCallback((item) => {
    dismissSearchFocus();
    const itemTheme = categoryThemes[item.category] || defaultTheme;
    navigation.navigate("Details", {
      item,
      currentTheme: itemTheme,
    });
  }, [navigation, dismissSearchFocus]);

  const renderItem = useCallback(
    ({ item }) => (
      <ExploreCard
        item={item}
        isDarkMode={isDarkMode}
        onPress={handleCardPress}
      />
    ),
    [isDarkMode, handleCardPress]
  );

  const keyExtractor = useCallback((item) => (item?.id ? String(item.id) : String(Math.random())), []);

  return (
    <ImageBackground source={bgSource} style={styles.screenDarkBg} resizeMode="cover">
      <LinearGradient
        colors={
          currentTheme?.colors && currentTheme.colors.length >= 3
            ? [
                currentTheme.colors[0],
                currentTheme.colors[1],
                "rgba(0, 0, 0, 0.72)",
                "rgba(0, 0, 0, 0.96)",
              ]
            : ["rgba(0, 0, 0, 0.45)", "rgba(0, 0, 0, 0.65)", "rgba(0, 0, 0, 0.95)"]
        }
        locations={[0, 0.38, 0.72, 1]}
        style={styles.flex1}
      >
        <View style={styles.container}>
          <StatusBar
            barStyle={isDarkMode ? "light-content" : "dark-content"}
            backgroundColor="transparent"
            translucent
          />

          <Animated.View
            pointerEvents={isSearchBarVisible || isSearchFocused ? "auto" : "none"}
            style={[
              styles.headerBar,
              {
                paddingTop: insets.top > 0 ? insets.top + 4 : (Platform.OS === "android" ? 34 : 10),
                backgroundColor: isDarkMode ? "#000000" : "#FFFFFF",
                transform: [{ translateY: searchTranslateY }],
                opacity: searchOpacity,
              },
            ]}
          >
            <View style={styles.searchBarRow}>
              <Pressable
                style={[
                  styles.searchBarInputWrapper,
                  isDarkMode ? styles.searchBarInputDark : styles.searchBarInputLight,
                  isSearchFocused && [
                    { borderColor: currentTheme?.accent || "#4CAF50" },
                    isDarkMode
                      ? styles.searchBarInputFocusedDark
                      : styles.searchBarInputFocusedLight,
                  ],
                ]}
                onPress={() => searchInputRef.current?.focus()}
              >
                <Feather
                  name="search"
                  size={18}
                  color={
                    isSearchFocused
                      ? currentTheme?.accent || "#4CAF50"
                      : isDarkMode
                      ? "#8E8E93"
                      : "#767676"
                  }
                  style={styles.searchIcon}
                />
                <TextInput
                  ref={searchInputRef}
                  style={[
                    styles.searchInput,
                    isDarkMode ? styles.searchInputDark : styles.searchInputLight,
                  ]}
                  placeholder="Pesquisar"
                  placeholderTextColor={isDarkMode ? "#8E8E93" : "#767676"}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  autoCorrect={false}
                  selectionColor={currentTheme?.accent || "#4CAF50"}
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity
                    onPress={() => setSearchQuery("")}
                    style={styles.clearButton}
                    hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                  >
                    <Ionicons
                      name="close-circle"
                      size={17}
                      color={isDarkMode ? "#8E8E93" : "#767676"}
                    />
                  </TouchableOpacity>
                )}
              </Pressable>

              <TouchableOpacity
                style={styles.photoIconButton}
                activeOpacity={0.7}
                onPress={() => {}}
              >
                <Ionicons
                  name="images-outline"
                  size={25}
                  color={isDarkMode ? "#FFFFFF" : "#000000"}
                />
              </TouchableOpacity>
            </View>
          </Animated.View>

          {loading ? (
            <ScrollView
              contentContainerStyle={[
                styles.flatListContent,
                {
                  paddingTop: headerHeight,
                  paddingBottom: bottomPadding,
                  backgroundColor: isDarkMode ? "#000000" : "#E5E7EB",
                },
              ]}
              showsVerticalScrollIndicator={false}
              scrollEnabled={false}
            >
              <ExploreSkeletonGrid isDarkMode={isDarkMode} currentTheme={currentTheme} />
            </ScrollView>
          ) : (
            <FadeInView duration={280} style={styles.flex1}>
              <FlatList
                style={styles.flex1}
                data={filteredDestinations}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
                numColumns={3}
                columnWrapperStyle={styles.columnWrapper}
                contentContainerStyle={[
                  styles.flatListContent,
                  {
                    paddingTop: headerHeight,
                    paddingBottom: bottomPadding,
                    backgroundColor: isDarkMode ? "#000000" : "#E5E7EB",
                  },
                ]}
                showsVerticalScrollIndicator={false}
                onScroll={handleScroll}
                onScrollBeginDrag={dismissSearchFocus}
                keyboardDismissMode="on-drag"
                keyboardShouldPersistTaps="handled"
                scrollEventThrottle={16}
                onEndReached={loadNextPage}
                onEndReachedThreshold={0.5}
                windowSize={7}
                maxToRenderPerBatch={12}
                initialNumToRender={12}
                removeClippedSubviews={Platform.OS === "android"}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                    tintColor={currentTheme?.accent || "#4CAF50"}
                    colors={[currentTheme?.accent || "#4CAF50"]}
                    progressViewOffset={headerHeight}
                  />
                }
                ListEmptyComponent={
                  <View style={styles.emptyStateContainer}>
                    <Ionicons
                      name="search-outline"
                      size={48}
                      color="#FFFFFF"
                    />
                    <Text style={styles.emptyStateText}>
                      Nenhum destino encontrado para sua pesquisa.
                    </Text>
                  </View>
                }
                ListFooterComponent={
                  loadingMore ? (
                    <View style={styles.loadingMoreContainer}>
                      <ActivityIndicator size="small" color={currentTheme?.accent || "#4CAF50"} />
                    </View>
                  ) : null
                }
              />
            </FadeInView>
          )}


        </View>
      </LinearGradient>
    </ImageBackground>
  );
}
