import React, { useState, useCallback, useRef, useMemo, useEffect } from "react";
import {
  View,
  ImageBackground,
  StatusBar,
  ActivityIndicator,
  Keyboard,
  BackHandler,
  Platform,
  RefreshControl,
  Animated,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import styles, { getCardDimensions } from "./favorites.styles";
import { useTheme } from "../../theme/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { FavoritesSkeletonList } from "../../shared/components/Skeleton";
import FavoriteCardItem from "./components/FavoriteCardItem";
import FavoriteHeader from "./components/FavoriteHeader";
import FavoriteDeleteModal from "./components/FavoriteDeleteModal";
import FavoriteEmptyState from "./components/FavoriteEmptyState";
import useFavoritesList from "./hooks/useFavoritesList";
import useFavoriteDelete from "./hooks/useFavoriteDelete";

const DEFAULT_GRADIENT = ["rgba(0, 0, 0, 0.45)", "rgba(0, 0, 0, 0.65)", "rgba(0, 0, 0, 0.95)", "rgba(0, 0, 0, 0.98)"];
const GRADIENT_LOCATIONS = [0, 0.38, 0.72, 1];

export default function Favorites({ navigation }) {
  const insets = useSafeAreaInsets();
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const [containerHeight, setContainerHeight] = useState(0);

  const handleContainerLayout = useCallback((e) => {
    const h = Math.round(e.nativeEvent.layout.height);
    if (h > 0 && Math.abs(h - containerHeight) > 1) {
      setContainerHeight(h);
    }
  }, [containerHeight]);

  const cardDimensions = useMemo(() => {
    return getCardDimensions(
      windowWidth,
      windowHeight,
      insets.bottom,
      insets.top,
      containerHeight
    );
  }, [windowWidth, windowHeight, insets.bottom, insets.top, containerHeight]);

  const { currentTheme, isDarkMode } = useTheme();
  const { user } = useAuth();

  const {
    searchQuery,
    setSearchQuery,
    flatListRef,
    scrollY,
    handleClearSearch,
    favorites,
    isShowingSkeleton,
    isRefetching,
    refetch,
    loadNextPage,
    isFetchingNextPage,
  } = useFavoritesList(user);

  const {
    itemToDelete,
    setItemToDelete,
    isDeleting,
    lastItemTitleRef,
    confirmDelete,
    cancelDelete,
  } = useFavoriteDelete();

  const [isFocused, setIsFocused] = useState(false);
  const searchInputRef = useRef(null);
  const isFocusedRef = useRef(isFocused);
  isFocusedRef.current = isFocused;

  const handleDeactivateSearch = useCallback(() => {
    setIsFocused(false);
    searchInputRef.current?.blur();
  }, []);

  useEffect(() => {
    const onHide = () => {
      if (isFocusedRef.current) {
        handleDeactivateSearch();
      }
    };
    const didHideSub = Keyboard.addListener("keyboardDidHide", onHide);
    const willHideSub = Keyboard.addListener("keyboardWillHide", onHide);
    return () => {
      didHideSub.remove();
      willHideSub.remove();
    };
  }, [handleDeactivateSearch]);

  useEffect(() => {
    const onBackPress = () => {
      if (isFocusedRef.current) {
        handleDeactivateSearch();
        return true;
      }
      return false;
    };
    const sub = BackHandler.addEventListener("hardwareBackPress", onBackPress);
    return () => sub.remove();
  }, [handleDeactivateSearch]);

  const primaryTextColor = "#FFFFFF";
  const secondaryTextColor = "rgba(255, 255, 255, 0.70)";
  const accentColor = currentTheme.accent || "#007AFF";
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

  const contentContainerStyle = useMemo(() => [
    {
      paddingBottom:
        favorites.length > cardDimensions.targetRows * 2
          ? cardDimensions.scrollPaddingBottom
          : 0,
    },
    favorites.length === 0 && [
      styles.emptyListContainer,
      { paddingBottom: cardDimensions.tabBarHeight },
    ],
  ], [favorites.length, cardDimensions]);

  const renderItem = useCallback(
    ({ item, index }) => (
      <FavoriteCardItem
        item={item}
        index={index}
        totalItems={favorites.length}
        scrollY={scrollY}
        cardDimensions={cardDimensions}
        navigation={navigation}
        currentTheme={currentTheme}
        isDarkMode={isDarkMode}
        setItemToDelete={setItemToDelete}
        cardWidth={cardDimensions.cardWidth}
        cardHeight={cardDimensions.cardHeight}
      />
    ),
    [
      favorites.length,
      scrollY,
      cardDimensions,
      navigation,
      currentTheme,
      isDarkMode,
      setItemToDelete,
    ]
  );

  const keyExtractor = useCallback(
    (item) => (item.destinationId || item.id || item.item_id).toString(),
    []
  );

  return (
    <View style={styles.root}>
      <ImageBackground source={bgSource} style={styles.backgroundImage} resizeMode="cover">
        <LinearGradient
          colors={gradientColors}
          locations={GRADIENT_LOCATIONS}
          style={styles.flex1}
        >
          <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
          <SafeAreaView edges={["top"]} style={styles.container}>
            <FavoriteHeader
              navigation={navigation}
              accentColor={accentColor}
              primaryTextColor={primaryTextColor}
              isDarkMode={isDarkMode}
              isRefetching={isRefetching}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              isFocused={isFocused}
              setIsFocused={setIsFocused}
              searchInputRef={searchInputRef}
              handleClearSearch={handleClearSearch}
            />

            <View
              style={[styles.flex1, styles.overflowVisible]}
              onLayout={handleContainerLayout}
            >
              {isShowingSkeleton ? (
                <FavoritesSkeletonList
                  isDarkMode={isDarkMode}
                  count={cardDimensions.isSmallScreen ? 4 : 6}
                  cardWidth={cardDimensions.cardWidth}
                  cardHeight={cardDimensions.cardHeight}
                />
              ) : (
                <Animated.FlatList
                  ref={flatListRef}
                  data={favorites}
                  key={`favorites-grid-${cardDimensions.isSmallScreen ? "small" : "std"}`}
                  numColumns={2}
                  columnWrapperStyle={styles.columnWrapper}
                  contentContainerStyle={contentContainerStyle}
                  onScrollBeginDrag={handleDeactivateSearch}
                  keyboardShouldPersistTaps="handled"
                  showsVerticalScrollIndicator={false}
                  keyExtractor={keyExtractor}
                  onEndReached={loadNextPage}
                  onEndReachedThreshold={0.5}
                  initialNumToRender={cardDimensions.targetRows * 2}
                  maxToRenderPerBatch={cardDimensions.targetRows * 2}
                  windowSize={7}
                  bounces={true}
                  overScrollMode="always"
                  scrollEventThrottle={16}
                  onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: Platform.OS !== "web" }
                  )}
                  refreshControl={
                    <RefreshControl
                      refreshing={isRefetching}
                      onRefresh={refetch}
                      tintColor={accentColor}
                      colors={[accentColor]}
                      progressViewOffset={-90}
                    />
                  }
                  renderItem={renderItem}
                  ListFooterComponent={
                    isFetchingNextPage ? (
                      <View style={styles.listFooterWrapper}>
                        <ActivityIndicator size="small" color={accentColor} />
                      </View>
                    ) : null
                  }
                  ListEmptyComponent={
                    <FavoriteEmptyState
                      searchQuery={searchQuery}
                      isDarkMode={isDarkMode}
                      primaryTextColor={primaryTextColor}
                      secondaryTextColor={secondaryTextColor}
                    />
                  }
                />
              )}
            </View>
          </SafeAreaView>
        </LinearGradient>
      </ImageBackground>

      <FavoriteDeleteModal
        itemToDelete={itemToDelete}
        isDeleting={isDeleting}
        lastItemTitleRef={lastItemTitleRef}
        isDarkMode={isDarkMode}
        confirmDelete={confirmDelete}
        cancelDelete={cancelDelete}
      />
    </View>
  );
}
