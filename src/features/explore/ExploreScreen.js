import React, { useCallback, useRef, useEffect, useMemo } from "react";
import {
  View,
  ScrollView,
  StatusBar,
  ImageBackground,
  Platform,
  FlatList,
  RefreshControl,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../../theme/ThemeContext";
import { ExploreSkeletonGrid } from "../../shared/components/Skeleton";
import FadeInView from "../../shared/components/FadeInView";
import styles, { GAP, categoryThemes, defaultTheme } from "./explore.styles";
import ExploreCard from "./components/ExploreCard";
import ExploreHeader from "./components/ExploreHeader";
import ExploreEmptyState from "./components/ExploreEmptyState";
import useExploreDestinations from "./hooks/useExploreDestinations";
import useExploreSearchBarAnimation from "./hooks/useExploreSearchBarAnimation";

const DEFAULT_GRADIENT = ["rgba(0, 0, 0, 0.45)", "rgba(0, 0, 0, 0.65)", "rgba(0, 0, 0, 0.95)"];
const GRADIENT_LOCATIONS = [0, 0.38, 0.72, 1];

export default function Explore({ navigation }) {
  const { currentTheme, isDarkMode } = useTheme();
  const insets = useSafeAreaInsets();
  const flatListRef = useRef(null);

  const headerPaddingTop = insets.top > 0 ? insets.top + 4 : (Platform.OS === "android" ? 34 : 10);
  const headerHeight = headerPaddingTop + 60;
  const bottomPadding = (insets.bottom || 0) + 85;

  const {
    searchQuery,
    setSearchQuery,
    normalizedSearch,
    destinations,
    isShowingSkeleton,
    loadingMore,
    isLoadingMoreRef,
    refreshing,
    isSearching,
    loadNextPage,
    handleRefresh,
  } = useExploreDestinations();

  const {
    isSearchFocused,
    setIsSearchFocused,
    searchInputRef,
    dismissSearchFocus,
    isSearchBarVisible,
    searchTranslateY,
    searchOpacity,
    handleScroll,
    handleScrollBeginDrag,
    handleScrollEnd,
  } = useExploreSearchBarAnimation(navigation, headerHeight, isLoadingMoreRef);

  useEffect(() => {
    flatListRef.current?.scrollToOffset({ offset: 0, animated: false });
  }, [normalizedSearch]);

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

  const bgSource = typeof currentTheme?.bg === "string" ? { uri: currentTheme.bg } : currentTheme?.bg;

  const gradientColors = useMemo(() => {
    if (currentTheme?.colors && currentTheme.colors.length >= 3) {
      return [
        currentTheme.colors[0],
        currentTheme.colors[1],
        "rgba(0, 0, 0, 0.72)",
        "rgba(0, 0, 0, 0.96)",
      ];
    }
    return DEFAULT_GRADIENT;
  }, [currentTheme?.colors]);

  const dynamicContentContainerStyle = useMemo(() => [
    styles.flatListContent,
    {
      paddingTop: headerHeight,
      paddingBottom: bottomPadding,
    },
    isDarkMode ? styles.bgDark : styles.bgLight,
  ], [headerHeight, bottomPadding, isDarkMode]);

  return (
    <ImageBackground source={bgSource} style={styles.screenDarkBg} resizeMode="cover">
      <LinearGradient
        colors={gradientColors}
        locations={GRADIENT_LOCATIONS}
        style={styles.flex1}
      >
        <View style={styles.container}>
          <StatusBar
            barStyle="light-content"
            backgroundColor="transparent"
            translucent
          />

          <ExploreHeader
            headerPaddingTop={headerPaddingTop}
            isDarkMode={isDarkMode}
            searchTranslateY={searchTranslateY}
            searchOpacity={searchOpacity}
            isSearchBarVisible={isSearchBarVisible}
            isSearchFocused={isSearchFocused}
            currentTheme={currentTheme}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            isSearching={isSearching}
            searchInputRef={searchInputRef}
            setIsSearchFocused={setIsSearchFocused}
          />

          {isShowingSkeleton ? (
            <ScrollView
              contentContainerStyle={dynamicContentContainerStyle}
              showsVerticalScrollIndicator={false}
              scrollEnabled={false}
            >
              <ExploreSkeletonGrid isDarkMode={isDarkMode} currentTheme={currentTheme} />
            </ScrollView>
          ) : (
            <FadeInView duration={350} style={styles.flex1}>
              <FlatList
                ref={flatListRef}
                style={styles.flex1}
                data={destinations}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
                numColumns={3}
                columnWrapperStyle={styles.columnWrapper}
                contentContainerStyle={dynamicContentContainerStyle}
                showsVerticalScrollIndicator={false}
                onScroll={handleScroll}
                onScrollBeginDrag={handleScrollBeginDrag}
                onScrollEndDrag={handleScrollEnd}
                onMomentumScrollEnd={handleScrollEnd}
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
                  <ExploreEmptyState searchFilter={normalizedSearch} />
                }
                ListFooterComponent={
                  loadingMore ? (
                    <View style={styles.listFooterWrapper}>
                      <ExploreSkeletonGrid isDarkMode={isDarkMode} currentTheme={currentTheme} rows={1} />
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
