import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  View,
  Image,
  ScrollView,
  StatusBar,
  ImageBackground,
  Animated,
  RefreshControl,
  useWindowDimensions,
  Platform,
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
import StateFeedbackView from "../../shared/components/StateFeedbackView";
import useHomeData from "./hooks/useHomeData";
import useHomeCategories from "./hooks/useHomeCategories";
import useHomeAnimations from "./hooks/useHomeAnimations";

const foliageImage = require("../../../assets/images/image.png");
const errorImage = require("../../../assets/images/error.png");
const notFoundImage = require("../../../assets/images/not-found.png");
const noConnectionImage = require("../../../assets/images/no-connection.png");

export default function Home({ navigation }) {
  const { user } = useAuth();
  const {
    categories = [],
    isLoadingCategories,
    isCategoriesError,
    activeCategory,
    activeCat,
    setActiveCat,
    currentTheme,
    themesByCat,
    isDarkMode,
    aestheticMode,
  } = useTheme();

  const isMinimalist = aestheticMode === "minimalista";

  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const topInset = insets.top || (Platform.OS === "android" ? (StatusBar.currentHeight || 0) : 0);
  const dims = useMemo(
    () => getHomeDimensions(windowWidth, windowHeight, topInset, insets.bottom, isMinimalist),
    [windowWidth, windowHeight, topInset, insets.bottom, isMinimalist]
  );

  const userName = useMemo(() => {
    const raw = user?.fullName || user?.name || "";
    const first = raw.trim().split(" ")[0];
    return first || "visitante";
  }, [user?.fullName, user?.name]);

  const selectedCategoryObj = activeCategory || categories[0];
  const selectedCategory = selectedCategoryObj?.slug || "florestas";

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
    isError,
    error,
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

  const errorConfig = useMemo(() => {
    if (!isError) return null;
    if (error?.status === 404) {
      return {
        title: "Conteúdo não encontrado",
        message: "A categoria ou seção solicitada não foi encontrada.",
        buttonText: "Recarregar início",
        imageSource: notFoundImage,
      };
    }
    if (error?.status >= 500) {
      return {
        title: "Serviço indisponível",
        message: "Nossos serviços estão passando por instabilidade no momento. Por favor, tente novamente em alguns instantes.",
        buttonText: "Tentar novamente",
        imageSource: errorImage,
      };
    }
    return {
      title: "Sem conexão",
      message: "Não foi possível conectar. Verifique sua conexão com a internet e tente novamente.",
      buttonText: "Tentar novamente",
      imageSource: noConnectionImage,
    };
  }, [isError, error]);

  const handleOpenSearch = useCallback(() => {
    setIsSearchVisible(true);
  }, []);

  const handleCloseSearch = useCallback(() => {
    setIsSearchVisible(false);
  }, []);

  const gradientColors = useMemo(() => {
    return ["rgba(0, 0, 0, 0.55)", "transparent", "rgba(0, 0, 0, 0.75)"];
  }, []);

  const isErrorBg = Boolean(errorConfig);
  const isMinimalistDark = isDarkMode && isMinimalist;
  const isWhiteBg = !isDarkMode && (isMinimalist || isErrorBg);

  const homeBody = (
    <>
      <StatusBar
        barStyle={isDarkMode ? "light-content" : isWhiteBg ? "dark-content" : "light-content"}
        backgroundColor="transparent"
        translucent
      />
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
                isMinimalist={isMinimalist}
              />

              <HomeCategoriesList
                categories={categories}
                isLoadingCategories={isLoadingCategories}
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
                isMinimalist={isMinimalist}
                hasError={Boolean(errorConfig) || (Boolean(isCategoriesError) && categories.length === 0)}
              />
            </View>

            {errorConfig ? (
              <View style={{ flex: 1, justifyContent: "center", alignItems: "center", minHeight: dims.availableHeight - 120 }}>
                <StateFeedbackView
                  imageSource={errorConfig.imageSource}
                  icon={errorConfig.icon}
                  title={errorConfig.title}
                  message={errorConfig.message}
                  buttonText={errorConfig.buttonText}
                  onButtonPress={handleRefresh}
                  isDarkMode={isDarkMode}
                  showDarkFilter={false}
                />
              </View>
            ) : (
              <>
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
                  isMinimalist={isMinimalist}
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
                  isMinimalist={isMinimalist}
                />
              </>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );

  return (
    <View
      style={
        isWhiteBg
          ? styles.whiteScreen
          : isMinimalistDark
          ? styles.minimalistDarkScreen
          : styles.blackScreen
      }
    >
      <SearchModal
        visible={isSearchVisible}
        onClose={handleCloseSearch}
        initialCategory={selectedCategory}
        categories={categories}
        currentTheme={currentTheme}
        isDarkMode={isDarkMode}
        navigation={navigation}
        bgSource={bgSource}
        isMinimalist={isMinimalist}
      />

      {isMinimalist ? (
        <View style={styles.flex1}>
          {!isErrorBg && (
            <View pointerEvents="none" style={styles.foliageContainer}>
              <Image
                source={foliageImage}
                style={styles.foliageHeader}
                resizeMode="cover"
              />
              <View
                style={
                  isDarkMode
                    ? styles.foliageDarkFilter
                    : styles.foliageWhiteFilter
                }
              />
              <LinearGradient
                colors={
                  isDarkMode
                    ? ["rgba(0, 0, 0, 0)", "rgba(10, 10, 10, 0.6)", "#0A0A0A"]
                    : ["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 0.6)", "#FFFFFF"]
                }
                locations={[0, 0.45, 1]}
                style={styles.foliageGradient}
              />
            </View>
          )}
          {homeBody}
        </View>
      ) : isErrorBg ? (
        <View style={styles.flex1}>{homeBody}</View>
      ) : (
        <ImageBackground source={bgSource} style={styles.backgroundImage} resizeMode="cover">
          <LinearGradient
            colors={gradientColors}
            locations={[0, 0.45, 1]}
            style={styles.flex1}
          >
            <Animated.View
              pointerEvents="none"
              style={[
                isDarkMode ? styles.bgDimOverlay : styles.bgDimOverlayLight,
                getDimAnimStyle(bgDimAnim),
              ]}
            />
            {homeBody}
          </LinearGradient>
        </ImageBackground>
      )}
    </View>
  );
}
