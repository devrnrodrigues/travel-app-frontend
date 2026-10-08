import React, { useState, useCallback, useMemo } from "react";
import {
  View,
  ScrollView,
  StatusBar,
  ImageBackground,
  Animated,
  RefreshControl,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import styles, {
  getHomeDimensions,
  getScrollContentPadding,
  getDimAnimStyle,
} from "./styles/home.styles";
import { useTheme } from "../../theme/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import HomeHeader from "./components/HomeHeader";
import HomeCategoriesList from "./components/HomeCategoriesList";
import HomeFeaturedList from "./components/HomeFeaturedList";
import HomeRecommendationsList from "./components/HomeRecommendationsList";
import SearchModal from "./components/SearchModal";
import useHomeData from "./hooks/useHomeData";
import useHomeCategories from "./hooks/useHomeCategories";
import useHomeAnimations from "./hooks/useHomeAnimations";

export default function Home({ navigation }) {
  const { user } = useAuth();
  const {
    categories = [],
    activeCategory,
    activeCat,
    setActiveCat,
    currentTheme,
    themesByCat,
    isDarkMode,
  } = useTheme();

  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const dims = useMemo(
    () => getHomeDimensions(windowWidth, windowHeight, insets.top, insets.bottom),
    [windowWidth, windowHeight, insets.top, insets.bottom]
  );

  const userName = useMemo(() => {
    const raw = user?.fullName || user?.name || user?.username || "";
    const first = raw.trim().split(" ")[0];
    return first || "visitante";
  }, [user?.fullName, user?.name, user?.username]);

  const selectedCategoryObj = activeCategory || categories[activeCat] || categories[0];
  const selectedCategory = selectedCategoryObj?.slug || selectedCategoryObj?.name || "florestas";

  const {
    flatListRef,
    destinations,
    topDestinations,
    isShowingSkeleton,
    isShowingTopSkeleton,
    isFetchingNextPage,
    isFetchingNextTopPage,
    refreshing,
    loadNextPage,
    loadNextTopPage,
    handleRefresh,
  } = useHomeData(selectedCategory);

  const {
    categoryScrollRef,
    handleCategoryPress,
    handleCategoryLayout,
    handleContainerLayout,
    handleContentSizeChange,
  } = useHomeCategories(activeCat, setActiveCat, windowWidth);

  const { bgDimAnim } = useHomeAnimations(activeCat);

  const bgSource = useMemo(() => {
    return typeof currentTheme.bg === "string" ? { uri: currentTheme.bg } : currentTheme.bg;
  }, [currentTheme.bg]);

  const handleOpenSearch = useCallback(() => {
    setIsSearchVisible(true);
  }, []);

  const handleCloseSearch = useCallback(() => {
    setIsSearchVisible(false);
  }, []);

  const gradientColors = useMemo(() => {
    if (currentTheme?.colors && currentTheme.colors.length >= 3) {
      return [
        currentTheme.colors[0],
        "rgba(0, 0, 0, 0.15)",
        "rgba(0, 0, 0, 0.65)",
      ];
    }
    return ["rgba(0, 0, 0, 0.55)", "rgba(0, 0, 0, 0.15)", "rgba(0, 0, 0, 0.65)"];
  }, [currentTheme?.colors]);

  return (
    <View style={styles.blackScreen}>
      <SearchModal
        visible={isSearchVisible}
        onClose={handleCloseSearch}
        initialCategory={selectedCategory}
        categories={categories}
        currentTheme={currentTheme}
        isDarkMode={isDarkMode}
        navigation={navigation}
        bgSource={bgSource}
      />

      <ImageBackground source={bgSource} style={styles.backgroundImage} resizeMode="cover">
        <LinearGradient
          colors={gradientColors}
          locations={[0, 0.40, 1]}
          style={styles.flex1}
        >
          <Animated.View
            pointerEvents="none"
            style={[
              styles.bgDimOverlay,
              getDimAnimStyle(bgDimAnim),
            ]}
          />

          <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
          <SafeAreaView edges={["top"]} style={styles.container}>
            <ScrollView
              style={styles.flex1}
              contentContainerStyle={[
                styles.scrollContent,
                getScrollContentPadding(dims.bottomBarHeight + dims.bottomSpacing),
              ]}
              showsVerticalScrollIndicator={false}
              bounces={true}
              alwaysBounceVertical={true}
              nestedScrollEnabled={true}
              keyboardShouldPersistTaps="handled"
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={handleRefresh}
                  tintColor={currentTheme?.accent || "#4CAF50"}
                  colors={[currentTheme?.accent || "#4CAF50"]}
                />
              }
            >
              <View style={styles.homeContentWrapper}>
                <View style={styles.topSection}>
                  <HomeHeader
                    userName={userName}
                    dims={dims}
                    isDarkMode={isDarkMode}
                    currentTheme={currentTheme}
                    onOpenSearch={handleOpenSearch}
                  />

                  <HomeCategoriesList
                    categories={categories}
                    activeCat={activeCat}
                    currentTheme={currentTheme}
                    themesByCat={themesByCat}
                    isDarkMode={isDarkMode}
                    dims={dims}
                    categoryScrollRef={categoryScrollRef}
                    onCategoryPress={handleCategoryPress}
                    onCategoryLayout={handleCategoryLayout}
                    onContainerLayout={handleContainerLayout}
                    onContentSizeChange={handleContentSizeChange}
                  />
                </View>

                <HomeFeaturedList
                  flatListRef={flatListRef}
                  destinations={destinations}
                  selectedCategory={selectedCategory}
                  currentTheme={currentTheme}
                  isDarkMode={isDarkMode}
                  navigation={navigation}
                  dims={dims}
                  isShowingSkeleton={isShowingSkeleton}
                  isFetchingNextPage={isFetchingNextPage}
                  onEndReached={loadNextPage}
                />

                <HomeRecommendationsList
                  topDestinations={topDestinations}
                  currentTheme={currentTheme}
                  isDarkMode={isDarkMode}
                  navigation={navigation}
                  dims={dims}
                  isShowingTopSkeleton={isShowingTopSkeleton}
                  isFetchingNextTopPage={isFetchingNextTopPage}
                  onEndReached={loadNextTopPage}
                />
              </View>
            </ScrollView>
          </SafeAreaView>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
}
