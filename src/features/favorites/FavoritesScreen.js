import React, { useState, useCallback, useRef, useMemo, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Modal,
  TouchableWithoutFeedback,
  TextInput,
  Keyboard,
  BackHandler,
  Platform,
  RefreshControl,
  Animated,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect } from "@react-navigation/native";
import { useQuery, useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import Feather from "react-native-vector-icons/Feather";
import Ionicons from "react-native-vector-icons/Ionicons";
import styles, { dialogStyles, getCardDimensions } from "./favorites.styles";
import { useTheme } from "../../theme/ThemeContext";
import { useAuth } from "../auth/context/AuthContext";
import { FavoritesSkeletonList } from "../../shared/components/Skeleton";
import { getFavoritesApi, removeFavoriteApi } from "./api/favoriteService";
import { getOptimizedImageUrl } from "../../shared/utils/imageUrl";

const foliageImage = require("../../../assets/images/image.png");
const foliageFooterImage = require("../../../assets/images/image2.png");
const EMPTY_STATE_GREEN = "#529A78";

const FavoriteCardItem = React.memo(function FavoriteCardItem({
  item,
  navigation,
  currentTheme,
  isDarkMode,
  setItemToDelete,
  cardWidth,
  cardHeight,
}) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const imgAnim = useRef(new Animated.Value(0)).current;

  const reviewCount = Number(
    item?.reviewCount ??
    item?.reviewsCount ??
    item?.destinationReviewCount ??
    (Array.isArray(item?.reviews) ? item.reviews.length : 0)
  );
  const hasRating = reviewCount >= 1;
  const ratingValue =
    item?.realRating && item.realRating !== "0.0" && item.realRating !== "0"
      ? item.realRating
      : item?.rating != null && Number(item.rating) > 0
        ? Number(item.rating).toFixed(1)
        : item?.destinationRating != null && Number(item.destinationRating) > 0
          ? Number(item.destinationRating).toFixed(1)
          : null;

  const handleImageLoad = () => {
    setImageLoaded(true);
    Animated.timing(imgAnim, {
      toValue: 1,
      duration: 220,
      useNativeDriver: Platform.OS !== "web",
    }).start();
  };

  const handlePress = () => {
    Keyboard.dismiss();
    navigation.navigate("Details", {
      item: {
        ...item,
        id: item.item_id || item.id,
        item_id: item.item_id || item.id,
      },
      currentTheme,
    });
  };

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      style={[
        styles.card,
        isDarkMode ? styles.cardDark : styles.cardLight,
        cardWidth && cardHeight ? { width: cardWidth, height: cardHeight } : null,
      ]}
      onPress={handlePress}
      onLongPress={() => setItemToDelete(item)}
      delayLongPress={450}
    >
      <View style={styles.cardInner}>
        {item.image_url ? (
          <>
            <Animated.Image
              source={{ uri: getOptimizedImageUrl(item.image_url, 450) }}
              style={[styles.cardImage, { opacity: imgAnim }]}
              resizeMode="cover"
              onLoad={handleImageLoad}
            />
            {!imageLoaded && (
              <View
                style={[
                  StyleSheet.absoluteFillObject,
                  { backgroundColor: isDarkMode ? "#252525" : "#E2E2E2" },
                ]}
              />
            )}
          </>
        ) : (
          <View
            style={[
              styles.cardPlaceholder,
              { backgroundColor: isDarkMode ? "#222222" : "#E5E5EA" },
            ]}
          >
            <Ionicons
              name="image-outline"
              size={32}
              color={isDarkMode ? "#666666" : "#999999"}
            />
            <Text
              style={[
                styles.cardPlaceholderText,
                { color: isDarkMode ? "#777777" : "#8E8E93" },
              ]}
            >
              Sem imagem
            </Text>
          </View>
        )}

        {hasRating && ratingValue ? (
          <View style={styles.ratingBadge}>
            <Ionicons name="star" size={10} color="#FFD700" />
            <Text style={styles.ratingText}>{ratingValue}</Text>
          </View>
        ) : null}


        <LinearGradient
          colors={["transparent", "rgba(0, 0, 0, 0.42)", "rgba(0, 0, 0, 0.88)"]}
          locations={[0, 0.42, 1]}
          style={styles.cardOverlay}
        >
          <Text style={styles.cardTitle} numberOfLines={1}>
            {item.title}
          </Text>
          {item.location ? (
            <View style={styles.locationRow}>
              <Feather
                name="map-pin"
                size={11}
                color={currentTheme.accent || "#007AFF"}
              />
              <Text style={styles.locationText} numberOfLines={1}>
                {item.location}
              </Text>
            </View>
          ) : null}
        </LinearGradient>
      </View>
    </TouchableOpacity>
  );
});

export default function Favorites({ navigation }) {
  const insets = useSafeAreaInsets();
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const cardDimensions = useMemo(() => {
    return getCardDimensions(
      windowWidth,
      windowHeight,
      insets.bottom,
      insets.top
    );
  }, [windowWidth, windowHeight, insets.bottom, insets.top]);

  const { currentTheme, isDarkMode } = useTheme();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const userId = user?.id || user?._id || "anon";

  const PAGE_SIZE = 10;

  const {
    data,
    isLoading,
    isRefetching,
    refetch,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["favorites", userId],
    enabled: !!user,
    queryFn: async ({ pageParam = 0 }) => {
      return getFavoritesApi({ page: pageParam, size: PAGE_SIZE });
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      if (!lastPage || lastPage.length < PAGE_SIZE) {
        return undefined;
      }
      return lastPageParam + 1;
    },
  });

  const { data: isFavoritesHidden } = useQuery({
    queryKey: ["hideFavorites"],
    queryFn: async () => {
      const val = await AsyncStorage.getItem("@debug_hide_favorites");
      return val === "true";
    },
    initialData: false,
  });

  const favorites = useMemo(() => {
    if (isFavoritesHidden || !data?.pages) return [];
    const flat = data.pages.flat();
    const seen = new Set();
    return flat.filter((item) => {
      const key = item?.destinationId || item?.id;
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [isFavoritesHidden, data]);

  const loadNextPage = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const loading = isLoading && favorites.length === 0;
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const lastItemTitleRef = useRef("");
  const flatListRef = useRef(null);

  const [searchQuery, setSearchQuery] = useState("");
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

  const filteredFavorites = useMemo(() => {
    if (!searchQuery.trim()) return favorites;
    const q = searchQuery.toLowerCase().trim();
    return favorites.filter((fav) => {
      const title = (fav.title || "").toLowerCase();
      const location = (fav.location || "").toLowerCase();
      return title.includes(q) || location.includes(q);
    });
  }, [favorites, searchQuery]);

  if (itemToDelete?.title) {
    lastItemTitleRef.current = itemToDelete.title;
  }

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      setIsDeleting(true);
      const destId = itemToDelete.destinationId || itemToDelete.id || itemToDelete.item_id;
      await removeFavoriteApi(destId);

      queryClient.setQueriesData({ queryKey: ["favorites"] }, (old) => {
        if (!old) return old;
        if (old.pages) {
          return {
            ...old,
            pages: old.pages.map((page) =>
              page.filter((fav) => (fav.destinationId || fav.id) !== destId)
            ),
          };
        }
        return (old || []).filter((fav) => (fav.destinationId || fav.id) !== destId);
      });
      setItemToDelete(null);
    } catch (error) {
      console.error("Erro ao remover favorito:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      queryClient.invalidateQueries({ queryKey: ["hideFavorites"] });
      queryClient.invalidateQueries({ queryKey: ["favorites", userId] });
    }, [queryClient, userId])
  );

  const screenBg = isDarkMode ? "#000000" : "#FFFFFF";
  const primaryTextColor = isDarkMode ? "#FFFFFF" : "#000000";
  const secondaryTextColor = isDarkMode ? "rgba(255, 255, 255, 0.6)" : "rgba(0, 0, 0, 0.55)";
  const accentColor = currentTheme.accent || "#007AFF";

  return (
    <View style={[styles.root, { backgroundColor: screenBg }]}>
      <Image
        source={foliageImage}
        style={styles.foliageHeader}
        resizeMode="cover"
        pointerEvents="none"
      />
      <View style={styles.foliageFooterContainer} pointerEvents="none">
        <Image
          source={foliageFooterImage}
          style={[
            styles.foliageFooter,
            !isDarkMode && styles.foliageFooterLight,
          ]}
          resizeMode="cover"
        />
      </View>
      <SafeAreaView edges={["top"]} style={styles.container}>
        <View style={styles.navHeader}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.navigate("Explore")}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={26} color={accentColor} />
            <Text style={[styles.backButtonText, { color: accentColor }]}>
              Explorar
            </Text>
          </TouchableOpacity>
          {isRefetching && (
            <ActivityIndicator size="small" color={accentColor} style={{ marginRight: 4 }} />
          )}
        </View>

        <View style={styles.titleContainer}>
          <Text style={[styles.largeTitle, { color: primaryTextColor }]}>
            Favoritos
          </Text>
        </View>

        <View style={styles.searchContainer}>
          <View
            style={[
              styles.searchBox,
              isDarkMode ? styles.searchBoxDark : styles.searchBoxLight,
              isFocused && { borderColor: accentColor },
            ]}
          >
            <Feather
              name="search"
              size={17}
              color={
                isFocused
                  ? accentColor
                  : isDarkMode
                  ? "rgba(255, 255, 255, 0.45)"
                  : "rgba(0, 0, 0, 0.4)"
              }
              style={styles.searchIcon}
            />
            <TextInput
              ref={searchInputRef}
              style={[
                styles.searchInput,
                isDarkMode ? styles.searchInputDark : styles.searchInputLight,
              ]}
              placeholder="Buscar"
              placeholderTextColor={
                isDarkMode ? "rgba(255, 255, 255, 0.45)" : "rgba(0, 0, 0, 0.4)"
              }
              value={searchQuery}
              onChangeText={setSearchQuery}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              returnKeyType="search"
              autoCapitalize="none"
              autoCorrect={false}
              selectionColor={accentColor}
            />
            {searchQuery.length > 0 ? (
              <TouchableOpacity
                onPress={() => {
                  setSearchQuery("");
                }}
                style={styles.searchClearBtn}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons
                  name="close-circle"
                  size={18}
                  color={isDarkMode ? "rgba(255, 255, 255, 0.5)" : "rgba(0, 0, 0, 0.45)"}
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => {
                  setIsFocused(true);
                  searchInputRef.current?.focus();
                }}
                style={styles.searchClearBtn}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                activeOpacity={0.7}
              >
                <Ionicons
                  name="mic"
                  size={17}
                  color={
                    isFocused
                      ? accentColor
                      : isDarkMode
                      ? "rgba(255, 255, 255, 0.45)"
                      : "rgba(0, 0, 0, 0.4)"
                  }
                />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={[styles.flex1, { overflow: "visible" }]}>
          {loading ? (
            <FavoritesSkeletonList
              isDarkMode={isDarkMode}
              count={cardDimensions.isSmallScreen ? 4 : 6}
            />
          ) : (
            <FlatList
              ref={flatListRef}
              data={filteredFavorites}
              key={`favorites-grid-${cardDimensions.isSmallScreen ? "small" : "std"}`}
              numColumns={2}
              columnWrapperStyle={styles.columnWrapper}
              contentContainerStyle={[
                {
                  paddingBottom:
                    filteredFavorites.length > cardDimensions.targetRows * 2
                      ? cardDimensions.scrollPaddingBottom
                      : 0,
                },
                filteredFavorites.length === 0 && {
                  flexGrow: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  paddingBottom: cardDimensions.tabBarHeight,
                },
              ]}
              onScrollBeginDrag={handleDeactivateSearch}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              keyExtractor={(item) =>
                (item.destinationId || item.id || item.item_id).toString()
              }
              onEndReached={loadNextPage}
              onEndReachedThreshold={0.5}
              initialNumToRender={cardDimensions.targetRows * 2}
              maxToRenderPerBatch={cardDimensions.targetRows * 2}
              windowSize={7}
              refreshControl={
                <RefreshControl
                  refreshing={isRefetching}
                  onRefresh={refetch}
                  tintColor={accentColor}
                  colors={[accentColor]}
                  progressViewOffset={-90}
                />
              }
              renderItem={({ item }) => (
                <FavoriteCardItem
                  item={item}
                  navigation={navigation}
                  currentTheme={currentTheme}
                  isDarkMode={isDarkMode}
                  setItemToDelete={setItemToDelete}
                  cardWidth={cardDimensions.cardWidth}
                  cardHeight={cardDimensions.cardHeight}
                />
              )}
              ListFooterComponent={
                isFetchingNextPage ? (
                  <View style={{ paddingVertical: 16, alignItems: "center" }}>
                    <ActivityIndicator size="small" color={accentColor} />
                  </View>
                ) : null
              }
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  {searchQuery.trim() ? (
                    <>
                      <View
                        style={[
                          styles.emptyIconContainer,
                          {
                            backgroundColor: isDarkMode
                              ? "rgba(255, 255, 255, 0.08)"
                              : "rgba(0, 0, 0, 0.05)",
                          },
                        ]}
                      >
                        <Feather
                          name="search"
                          size={32}
                          color={secondaryTextColor}
                        />
                      </View>
                      <Text
                        style={[styles.emptyTitle, { color: primaryTextColor }]}
                      >
                        Nenhum resultado
                      </Text>
                      <Text
                        style={[
                          styles.emptySubtitle,
                          { color: secondaryTextColor },
                        ]}
                      >
                        Nenhum destino salvo corresponde a "{searchQuery}".
                      </Text>
                    </>
                  ) : (
                    <>
                      <View style={styles.emptyHeartContainer}>
                        <Ionicons
                          name="heart"
                          size={46}
                          color={EMPTY_STATE_GREEN}
                        />
                      </View>
                      <Text
                        style={[styles.emptyTitle, { color: primaryTextColor }]}
                      >
                        Nenhum favorito ainda
                      </Text>
                      <Text
                        style={[
                          styles.emptySubtitle,
                          { color: secondaryTextColor },
                        ]}
                      >
                        Toque no coração nos destinos que você mais gostar para
                        guardá-los aqui.
                      </Text>
                      <TouchableOpacity
                        style={[
                          styles.emptyActionBtn,
                          { backgroundColor: EMPTY_STATE_GREEN },
                        ]}
                        onPress={() => navigation.navigate("Explore")}
                        activeOpacity={0.8}
                      >
                        <Feather name="compass" size={13} color="#FFFFFF" />
                        <Text style={styles.emptyActionBtnText}>
                          Explorar destinos
                        </Text>
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              }
            />
          )}
        </View>
      </SafeAreaView>

      <Modal
        visible={!!itemToDelete}
        transparent={true}
        animationType="fade"
        statusBarTranslucent={true}
        navigationBarTranslucent={true}
        onRequestClose={() => !isDeleting && setItemToDelete(null)}
      >
        <TouchableWithoutFeedback
          onPress={() => !isDeleting && setItemToDelete(null)}
        >
          <View style={dialogStyles.overlay}>
            <TouchableWithoutFeedback>
              <View
                style={[
                  dialogStyles.dialogCard,
                  !isDarkMode && dialogStyles.dialogCardLight,
                ]}
              >
                <View style={dialogStyles.contentSection}>
                  <Text
                    style={[
                      dialogStyles.title,
                      !isDarkMode && dialogStyles.titleLight,
                    ]}
                  >
                    Remover dos favoritos?
                  </Text>
                  <Text
                    style={[
                      dialogStyles.message,
                      !isDarkMode && dialogStyles.messageLight,
                    ]}
                  >
                    Deseja remover "
                    {itemToDelete?.title || lastItemTitleRef.current}
                    " da sua lista de destinos salvos?
                  </Text>
                </View>

                <TouchableOpacity
                  style={[
                    dialogStyles.actionButton,
                    !isDarkMode && dialogStyles.actionButtonLight,
                  ]}
                  onPress={confirmDelete}
                  disabled={isDeleting}
                  activeOpacity={0.65}
                >
                  {isDeleting ? (
                    <ActivityIndicator size="small" color="#FF3B30" />
                  ) : (
                    <Text style={dialogStyles.deleteText}>Excluir</Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    dialogStyles.actionButton,
                    dialogStyles.lastButton,
                    !isDarkMode && dialogStyles.actionButtonLight,
                  ]}
                  onPress={() => setItemToDelete(null)}
                  disabled={isDeleting}
                  activeOpacity={0.65}
                >
                  <Text
                    style={[
                      dialogStyles.cancelText,
                      !isDarkMode && dialogStyles.cancelTextLight,
                    ]}
                  >
                    Cancelar
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}
