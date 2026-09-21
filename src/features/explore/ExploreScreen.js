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

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      style={[styles.gridItem, { width: COLUMN_WIDTH, height: CARD_HEIGHT }]}
      onPress={handlePress}
    >
      <Animated.Image
        source={{ uri: item.image_url }}
        style={[styles.gridImage, { opacity: imgAnim }]}
        resizeMode="cover"
        onLoad={handleImageLoad}
      />
      {!imageLoaded && (
        <View style={[styles.imageSkeletonOverlay, isDarkMode ? styles.imageSkeletonDark : styles.imageSkeletonLight]} />
      )}

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
    hasPreviousPage,
    fetchPreviousPage,
    isFetchingPreviousPage,
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
    getPreviousPageParam: (firstPage, allPages, firstPageParam) => {
      if (firstPageParam <= 0) {
        return undefined;
      }
      return firstPageParam - 1;
    },
    maxPages: 10,
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
  const refreshing = isRefetching;

  const insets = useSafeAreaInsets();
  const topInset = Math.max(insets.top, Platform.OS === "android" ? 38 : 20);
  const searchBarTop = topInset + 30;

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
  const autoHideTimerRef = useRef(null);

  const hideSearchBar = useCallback(() => {
    if (isSearchFocusedRef.current || !isSearchBarVisibleRef.current) return;
    if (autoHideTimerRef.current) {
      clearTimeout(autoHideTimerRef.current);
      autoHideTimerRef.current = null;
    }
    isSearchBarVisibleRef.current = false;
    setIsSearchBarVisible(false);
    Animated.timing(searchBarAnim, {
      toValue: 1,
      duration: 120,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, [searchBarAnim]);

  const scheduleAutoHide = useCallback(() => {
    if (autoHideTimerRef.current) {
      clearTimeout(autoHideTimerRef.current);
      autoHideTimerRef.current = null;
    }
    if (!isSearchFocusedRef.current && isSearchBarVisibleRef.current) {
      autoHideTimerRef.current = setTimeout(() => {
        hideSearchBar();
      }, 3000);
    }
  }, [hideSearchBar]);

  const showSearchBar = useCallback(() => {
    if (autoHideTimerRef.current) {
      clearTimeout(autoHideTimerRef.current);
      autoHideTimerRef.current = null;
    }
    if (!isSearchBarVisibleRef.current) {
      isSearchBarVisibleRef.current = true;
      setIsSearchBarVisible(true);
      Animated.timing(searchBarAnim, {
        toValue: 0,
        duration: 120,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }).start();
    }
    scheduleAutoHide();
  }, [searchBarAnim, scheduleAutoHide]);

  useEffect(() => {
    isSearchFocusedRef.current = isSearchFocused;
    if (isSearchFocused) {
      if (autoHideTimerRef.current) {
        clearTimeout(autoHideTimerRef.current);
        autoHideTimerRef.current = null;
      }
      showSearchBar();
    } else {
      scheduleAutoHide();
    }
  }, [isSearchFocused, showSearchBar, scheduleAutoHide]);

  useEffect(() => {
    return () => {
      if (autoHideTimerRef.current) {
        clearTimeout(autoHideTimerRef.current);
        autoHideTimerRef.current = null;
      }
    };
  }, []);

  const loadNextPage = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const loadPreviousPage = useCallback(() => {
    if (hasPreviousPage && !isFetchingPreviousPage) {
      fetchPreviousPage();
    }
  }, [hasPreviousPage, isFetchingPreviousPage, fetchPreviousPage]);

  const handleScroll = useCallback((event) => {
    const { nativeEvent } = event;
    const currentY = nativeEvent.contentOffset.y;
    const diff = currentY - lastScrollY.current;

    if (currentY <= 20) {
      if (!isSearchBarVisibleRef.current) {
        showSearchBar();
      }
    } else if (diff > 18 && currentY > 50) {
      if (!isSearchFocusedRef.current && isSearchBarVisibleRef.current) {
        hideSearchBar();
      }
    } else if (diff < -15) {
      if (!isSearchBarVisibleRef.current) {
        showSearchBar();
      }
      if (currentY <= 150) {
        loadPreviousPage();
      }
    }

    lastScrollY.current = currentY;
  }, [hideSearchBar, showSearchBar, loadPreviousPage]);

  const searchTranslateY = searchBarAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -(searchBarTop + 75)],
  });

  const searchOpacity = searchBarAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });

  useFocusEffect(
    useCallback(() => {
      showSearchBar();
      return () => {
        if (autoHideTimerRef.current) {
          clearTimeout(autoHideTimerRef.current);
          autoHideTimerRef.current = null;
        }
      };
    }, [showSearchBar])
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
    const itemTheme = categoryThemes[item.category] || defaultTheme;
    navigation.navigate("Details", {
      item,
      currentTheme: itemTheme,
    });
  }, [navigation]);

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

  const keyExtractor = useCallback((item, index) => (item?.id ? `${item.id}-${index}` : String(index)), []);

  return (
    <ImageBackground source={bgSource} style={styles.screenDarkBg} resizeMode="cover">
      <LinearGradient
        colors={["rgba(10, 10, 10, 0.72)", "rgba(5, 5, 5, 0.88)"]}
        style={styles.flex1}
      >
        <View style={styles.container}>
          <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

          {loading ? (
            <ScrollView
              contentContainerStyle={styles.flatListContent}
              showsVerticalScrollIndicator={false}
              scrollEnabled={false}
            >
              <ExploreSkeletonGrid isDarkMode={isDarkMode} currentTheme={currentTheme} />
            </ScrollView>
          ) : (
            <FadeInView duration={280} style={styles.flex1}>
              <FlatList
                data={filteredDestinations}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
                numColumns={3}
                columnWrapperStyle={styles.columnWrapper}
                contentContainerStyle={styles.flatListContent}
                showsVerticalScrollIndicator={false}
                onScroll={handleScroll}
                onScrollBeginDrag={dismissSearchFocus}
                keyboardDismissMode="on-drag"
                keyboardShouldPersistTaps="handled"
                scrollEventThrottle={16}
                onEndReached={loadNextPage}
                onEndReachedThreshold={0.5}
                windowSize={5}
                maxToRenderPerBatch={12}
                initialNumToRender={12}
                removeClippedSubviews={Platform.OS === "android"}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                    tintColor={currentTheme?.accent || "#4CAF50"}
                    colors={[currentTheme?.accent || "#4CAF50"]}
                  />
                }
                ListHeaderComponent={
                  isFetchingPreviousPage ? (
                    <View style={styles.loadingMoreContainer}>
                      <ActivityIndicator size="small" color={currentTheme?.accent || "#4CAF50"} />
                    </View>
                  ) : null
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

          { }
          <Animated.View
            pointerEvents={isSearchBarVisible || isSearchFocused ? "auto" : "none"}
            style={[
              styles.searchBarContainer,
              {
                top: searchBarTop,
                transform: [{ translateY: searchTranslateY }],
                opacity: searchOpacity,
                zIndex: 9999,
                elevation: 20,
              },
              !isDarkMode && styles.searchBarLight,
              isSearchFocused && [styles.searchBarFocusedBase, { borderColor: currentTheme?.accent || "#4CAF50" }, !isDarkMode ? styles.searchBarFocusedLight : styles.searchBarFocusedDark],
            ]}
          >
            <Pressable
              style={styles.searchBarInner}
              onPress={() => searchInputRef.current?.focus()}
            >
              <Feather
                name="search"
                size={18}
                color={isSearchFocused ? (currentTheme?.accent || "#4CAF50") : "#FFFFFF"}
                style={styles.searchIcon}
              />
              <TextInput
                ref={searchInputRef}
                style={[styles.searchInput, !isDarkMode && styles.searchInputLight]}
                placeholder="Pesquisar destinos, locais..."
                placeholderTextColor={!isDarkMode ? "rgba(255, 255, 255, 0.65)" : (isSearchFocused ? "rgba(255, 255, 255, 0.65)" : "rgba(255, 255, 255, 0.75)")}
                value={searchQuery}
                onChangeText={setSearchQuery}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                autoCorrect={false}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity
                  onPress={() => setSearchQuery("")}
                  style={styles.clearButton}
                  hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                >
                  <Feather name="x" size={16} color="#FFFFFF" />
                </TouchableOpacity>
              )}
            </Pressable>
          </Animated.View>
        </View>
      </LinearGradient>
    </ImageBackground>
  );
}
