import React, { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { View, Text, ScrollView, TouchableOpacity, FlatList, StatusBar, ImageBackground, Animated, StyleSheet, Easing, ActivityIndicator, Platform, Dimensions, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import Feather from "react-native-vector-icons/Feather";
import styles from "./home.styles";
import { useTheme } from "../../theme/ThemeContext";
import { useAuth } from "../auth/context/AuthContext";
import { HomeSkeletonList } from "../../shared/components/Skeleton";
import FadeInView from "../../shared/components/FadeInView";
import HomeCardItem from "./components/HomeCardItem";
import SearchModal from "./components/SearchModal";
import { getDestinations } from "../destinations/api/destinationService";



const CategoryTabItem = React.memo(function CategoryTabItem({
  cat,
  index,
  isActive,
  accentColor,
  onPress,
  onLayout,
}) {
  const lineAnim = useRef(new Animated.Value(isActive ? 1 : 0.01)).current;

  useEffect(() => {
    if (isActive) {
      lineAnim.setValue(0.01);
      Animated.spring(lineAnim, {
        toValue: 1,
        damping: 15,
        stiffness: 200,
        mass: 0.6,
        useNativeDriver: true,
      }).start();
    }
  }, [isActive]);

  const lineScaleX = lineAnim.interpolate({
    inputRange: [0.01, 1],
    outputRange: [0.01, 1],
  });

  return (
    <TouchableOpacity
      style={styles.categoryItem}
      onPress={onPress}
      onLayout={onLayout}
      activeOpacity={0.75}
    >
      <View style={styles.centerAligned}>
        <View style={styles.rowCenter}>
          <Text
            style={[
              styles.categoryText,
              styles.categoryTextDark,
              { color: isActive ? accentColor : "#FFF" },
              isActive && styles.categoryTextActive,
            ]}
          >
            {cat}
          </Text>
        </View>
        {isActive && (
          <Animated.View
            style={[
              styles.activeLine,
              {
                backgroundColor: accentColor,
                transform: [{ scaleX: lineScaleX }],
              },
            ]}
          />
        )}
      </View>
    </TouchableOpacity>
  );
});

export default function Home({ navigation }) {
  const { user } = useAuth();
  const { categories = [], activeCategory, activeCat, setActiveCat, currentTheme, themesByCat, isDarkMode } = useTheme();
  const queryClient = useQueryClient();
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const userName = useMemo(() => {
    const raw = user?.fullName || user?.name || user?.username || "";
    const first = raw.trim().split(" ")[0];
    return first || "visitante";
  }, [user?.fullName, user?.name, user?.username]);

  const selectedCategoryObj = activeCategory || categories[activeCat] || categories[0];
  const selectedCategory = selectedCategoryObj?.slug || selectedCategoryObj?.name || "florestas";
  const selectedTheme = themesByCat[activeCat] || currentTheme;

  const categoryScrollRef = useRef(null);
  const flatListRef = useRef(null);
  const itemLayouts = useRef({});
  const [scrollWidth, setScrollWidth] = useState(Dimensions.get("window").width);
  const [contentWidth, setContentWidth] = useState(0);

  const centerCategory = useCallback((index) => {
    const layout = itemLayouts.current[index];
    if (layout && categoryScrollRef.current && scrollWidth > 0) {
      const targetX = layout.x - (scrollWidth / 2) + (layout.width / 2);
      const maxScroll = Math.max(0, contentWidth - scrollWidth);
      const clampedX = Math.max(0, Math.min(targetX, maxScroll));
      categoryScrollRef.current.scrollTo({ x: clampedX, animated: true });
    }
  }, [scrollWidth, contentWidth]);

  const handleCategoryPress = useCallback((index) => {
    setActiveCat(index);
    centerCategory(index);
  }, [setActiveCat, centerCategory]);

  useEffect(() => {
    centerCategory(activeCat);
  }, [activeCat, centerCategory]);

  useEffect(() => {
    flatListRef.current?.scrollToOffset({ offset: 0, animated: false });
  }, [selectedCategory]);

  const PAGE_SIZE = 6;

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

  const loading = isLoading && destinations.length === 0;

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

  const keyExtractor = useCallback((item) => (item?.id ? String(item.id) : String(Math.random())), []);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        refetch(),
        queryClient.invalidateQueries({ queryKey: ["categories"] }),
      ]);
    } catch (e) {
      console.error(e);
    } finally {
      setRefreshing(false);
    }
  }, [refetch, queryClient]);

  const bgSource = useMemo(() => {
    return typeof currentTheme.bg === "string" ? { uri: currentTheme.bg } : currentTheme.bg;
  }, [currentTheme.bg]);

  const bgDimAnim = useRef(new Animated.Value(0)).current;
  const isFirstCatRender = useRef(true);

  useEffect(() => {
    if (isFirstCatRender.current) {
      isFirstCatRender.current = false;
      return;
    }
    bgDimAnim.setValue(0);
    Animated.sequence([
      Animated.timing(bgDimAnim, {
        toValue: 0.5,
        duration: 130,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(bgDimAnim, {
        toValue: 0,
        duration: 260,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();
  }, [activeCat]);

  const handleOpenSearch = useCallback(() => {
    setIsSearchVisible(true);
  }, []);

  const handleCloseSearch = useCallback(() => {
    setIsSearchVisible(false);
  }, []);

  return (
    <View style={styles.blackScreen}>
      <SearchModal
        visible={isSearchVisible}
        onClose={handleCloseSearch}
        destinations={destinations}
        loading={loading}
        currentTheme={currentTheme}
        isDarkMode={isDarkMode}
        navigation={navigation}
        bgSource={bgSource}
      />

      <ImageBackground source={bgSource} style={styles.backgroundImage} resizeMode="cover">
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
          <Animated.View
            pointerEvents="none"
            style={[
              StyleSheet.absoluteFillObject,
              {
                backgroundColor: "#000",
                opacity: bgDimAnim,
              },
            ]}
          />
          <StatusBar barStyle="light-content" />
          <SafeAreaView style={styles.container}>
            <ScrollView
              style={styles.flex1}
              contentContainerStyle={{ flexGrow: 1 }}
              showsVerticalScrollIndicator={false}
              bounces={true}
              alwaysBounceVertical={true}
              nestedScrollEnabled={true}
              keyboardShouldPersistTaps="handled"
              refreshControl={
                <RefreshControl
                  refreshing={refreshing || isRefetching}
                  onRefresh={handleRefresh}
                  tintColor={currentTheme?.accent || "#4CAF50"}
                  colors={[currentTheme?.accent || "#4CAF50"]}
                />
              }
            >
              <View style={styles.header}>
                <Text
                  style={[styles.headerTitle, styles.headerTitleDark, { color: "#FFF" }]}
                  numberOfLines={1}
                >
                  {`Olá, ${userName}`}
                </Text>
                <View style={styles.headerIcons}>
                  <TouchableOpacity
                    style={[
                      styles.iconButton,
                      isDarkMode ? styles.iconButtonDark : styles.iconButtonLight,
                    ]}
                    onPress={handleOpenSearch}
                  >
                    <Feather name="search" size={20} color={currentTheme.accent} />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.categoriesSection}>
                <ScrollView
                  ref={categoryScrollRef}
                  horizontal
                  nestedScrollEnabled={true}
                  showsHorizontalScrollIndicator={false}
                  onLayout={(e) => setScrollWidth(e.nativeEvent.layout.width)}
                  onContentSizeChange={(w) => setContentWidth(w)}
                  contentContainerStyle={styles.categoriesContainer}
                >
                  {categories.map((catItem, index) => {
                    const theme = themesByCat[index] || currentTheme;
                    return (
                      <CategoryTabItem
                        key={catItem.id || catItem.slug || catItem.name || String(index)}
                        cat={catItem.name}
                        index={index}
                        isActive={activeCat === index}
                        accentColor={theme.accent}
                        onLayout={(e) => {
                          itemLayouts.current[index] = e.nativeEvent.layout;
                        }}
                        onPress={() => handleCategoryPress(index)}
                      />
                    );
                  })}
                </ScrollView>
              </View>

              <View style={styles.contentContainer}>
                {loading ? (
                  <HomeSkeletonList isDarkMode={isDarkMode} currentTheme={currentTheme} />
                ) : (
                  <FadeInView key={selectedCategory} duration={280} style={styles.flex1}>
                    <FlatList
                      ref={flatListRef}
                      data={destinations}
                      keyExtractor={keyExtractor}
                      horizontal
                      nestedScrollEnabled={true}
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={styles.cardsList}
                      onEndReached={loadNextPage}
                      onEndReachedThreshold={0.3}
                      windowSize={11}
                      maxToRenderPerBatch={8}
                      initialNumToRender={8}
                      removeClippedSubviews={false}
                      renderItem={({ item }) => (
                        <HomeCardItem
                          item={item}
                          currentTheme={currentTheme}
                          isDarkMode={isDarkMode}
                          navigation={navigation}
                        />
                      )}
                      ListFooterComponent={
                        isFetchingNextPage ? (
                          <View style={{ justifyContent: "center", alignItems: "center", width: 80 }}>
                            <ActivityIndicator size="small" color={currentTheme.accent || "#4CAF50"} />
                          </View>
                        ) : null
                      }
                    />
                  </FadeInView>
                )}
              </View>
            </ScrollView>
          </SafeAreaView>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
}
