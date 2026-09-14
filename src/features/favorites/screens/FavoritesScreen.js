import React, { useState, useCallback, useRef, useMemo, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  ImageBackground,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
  Dimensions,
  Animated,
  TextInput,
  Keyboard,
  BackHandler,
  Easing,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect } from "@react-navigation/native";
import Feather from "react-native-vector-icons/Feather";
import { supabase } from "../../../config/supabase";
import styles, { dialogStyles } from "../styles/favorites.styles";
import { useTheme } from "../../../theme/ThemeContext";
import { FavoritesSkeletonList, SkeletonBox } from "../../../shared/components/Skeleton";
import FadeInView from "../../../shared/components/FadeInView";

const { width, height: WINDOW_HEIGHT } = Dimensions.get("window");

const DEFAULT_LIST_HEIGHT = WINDOW_HEIGHT - 120;
const BOTTOM_BAR_SPACE = 120;
const TOP_PADDING = 10;

const FavoriteCardItem = React.memo(function FavoriteCardItem({
  item,
  index,
  totalItems,
  scrollY,
  cardSlot,
  cardHeight,
  cardMarginBottom,
  currentTheme,
  isDarkMode,
  navigation,
  setItemToDelete,
}) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const imgAnim = useRef(new Animated.Value(0)).current;
  const itemOffset = index * cardSlot;
  const count = typeof totalItems === "number" ? totalItems : 0;

  const handleImageLoad = () => {
    setImageLoaded(true);
    Animated.timing(imgAnim, {
      toValue: 1,
      duration: 220,
      useNativeDriver: Platform.OS !== "web",
    }).start();
  };
  const canFoldTop = count > 6 && index < count - 6;
  const canFoldBottom = count > 6 && index >= 6;

  let rotateX = "0deg";
  let translateY = 0;
  let scale = 1;
  let opacity = 1;

  if (canFoldTop && canFoldBottom) {
    const inputRange = [
      Math.round(itemOffset - 5.95 * cardSlot),
      Math.round(itemOffset - 5.45 * cardSlot),
      Math.round(itemOffset - 5.0 * cardSlot),
      Math.round(itemOffset),
      Math.round(itemOffset + 0.45 * cardSlot),
      Math.round(itemOffset + 0.95 * cardSlot),
    ];
    rotateX = scrollY.interpolate({
      inputRange,
      outputRange: ["60deg", "28deg", "0deg", "0deg", "-28deg", "-60deg"],
      extrapolate: "clamp",
    });
    translateY = scrollY.interpolate({
      inputRange,
      outputRange: [20, 8, 0, 0, -8, -20],
      extrapolate: "clamp",
    });
    scale = scrollY.interpolate({
      inputRange,
      outputRange: [0.94, 0.98, 1, 1, 0.98, 0.94],
      extrapolate: "clamp",
    });
    opacity = scrollY.interpolate({
      inputRange,
      outputRange: [0, 0.9, 1, 1, 0.9, 0],
      extrapolate: "clamp",
    });
  } else if (canFoldTop) {
    const inputRange = [
      Math.round(itemOffset),
      Math.round(itemOffset + 0.45 * cardSlot),
      Math.round(itemOffset + 0.95 * cardSlot),
    ];
    rotateX = scrollY.interpolate({
      inputRange,
      outputRange: ["0deg", "-28deg", "-60deg"],
      extrapolate: "clamp",
    });
    translateY = scrollY.interpolate({
      inputRange,
      outputRange: [0, -8, -20],
      extrapolate: "clamp",
    });
    scale = scrollY.interpolate({
      inputRange,
      outputRange: [1, 0.98, 0.94],
      extrapolate: "clamp",
    });
    opacity = scrollY.interpolate({
      inputRange,
      outputRange: [1, 0.9, 0],
      extrapolate: "clamp",
    });
  } else if (canFoldBottom) {
    const inputRange = [
      Math.round(itemOffset - 5.95 * cardSlot),
      Math.round(itemOffset - 5.45 * cardSlot),
      Math.round(itemOffset - 5.0 * cardSlot),
    ];
    rotateX = scrollY.interpolate({
      inputRange,
      outputRange: ["60deg", "28deg", "0deg"],
      extrapolate: "clamp",
    });
    translateY = scrollY.interpolate({
      inputRange,
      outputRange: [20, 8, 0],
      extrapolate: "clamp",
    });
    scale = scrollY.interpolate({
      inputRange,
      outputRange: [0.94, 0.98, 1],
      extrapolate: "clamp",
    });
    opacity = scrollY.interpolate({
      inputRange,
      outputRange: [0, 0.9, 1],
      extrapolate: "clamp",
    });
  }

  const imageSize = Math.max(48, cardHeight - 20);

  return (
    <Animated.View
      style={[{ transform: [{ perspective: 700 }, { translateY }, { rotateX }, { scale }], opacity }]}
    >
      <TouchableOpacity
        activeOpacity={0.85}
        style={[styles.cardBase, !isDarkMode ? styles.cardLight : styles.cardDark, { height: cardHeight, marginBottom: cardMarginBottom }]}
        onPress={() => {
          Keyboard.dismiss();
          navigation.navigate("Details", {
            item: {
              ...item,
              id: item.item_id || item.id,
              item_id: item.item_id || item.id,
            },
            currentTheme,
          });
        }}
        onLongPress={() => setItemToDelete(item)}
        delayLongPress={450}
      >
        <View
          style={[styles.imageWrapper, { width: imageSize, height: imageSize }]}
        >
          <Animated.Image
            source={{ uri: item.image_url }}
            style={[{ width: imageSize, height: imageSize, borderRadius: 13, opacity: imgAnim }]}
            onLoad={handleImageLoad}
          />
          {!imageLoaded && (
            <SkeletonBox
              width={imageSize}
              height={imageSize}
              borderRadius={13}
              isDarkMode={isDarkMode}
              style={isDarkMode ? styles.imageSkeletonDark : styles.imageSkeletonLight}
            />
          )}
        </View>

        <View style={styles.cardInfo}>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {item.title}
          </Text>

          <View style={styles.locationRow}>
            <Feather name="map-pin" size={12} color={currentTheme.accent} />
            <Text style={styles.locationText} numberOfLines={1}>
              {item.location}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
});

export default function Favorites({ navigation }) {
  const { currentTheme, isDarkMode } = useTheme();
  const bgSource = typeof currentTheme.bg === "string" ? { uri: currentTheme.bg } : currentTheme.bg;

  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const lastItemTitleRef = useRef("");
  const isInitialLoad = useRef(true);
  const flatListRef = useRef(null);
  const scrollOffsetRef = useRef(0);

  const scrollY = useRef(new Animated.Value(0)).current;
  const [listHeight, setListHeight] = useState(DEFAULT_LIST_HEIGHT);

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const searchInputRef = useRef(null);
  const searchWidthAnim = useRef(new Animated.Value(0)).current;
  const titleAnim = useRef(new Animated.Value(0)).current;

  const handleOpenSearch = () => {
    setIsSearchOpen(true);
    setIsFocused(true);
    Animated.parallel([
      Animated.timing(searchWidthAnim, {
        toValue: 1,
        duration: 280,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }),
      Animated.timing(titleAnim, {
        toValue: 1,
        duration: 220,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start(() => {
      searchInputRef.current?.focus();
    });
  };

  const handleCloseSearch = () => {
    Keyboard.dismiss();
    setSearchQuery("");
    setIsFocused(false);
    Animated.parallel([
      Animated.timing(searchWidthAnim, {
        toValue: 0,
        duration: 240,
        easing: Easing.inOut(Easing.cubic),
        useNativeDriver: false,
      }),
      Animated.timing(titleAnim, {
        toValue: 0,
        duration: 240,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsSearchOpen(false);
    });
  };

  useEffect(() => {
    const onBackPress = () => {
      if (isSearchOpen) {
        handleCloseSearch();
        return true;
      }
      return false;
    };
    const sub = BackHandler.addEventListener("hardwareBackPress", onBackPress);
    return () => sub.remove();
  }, [isSearchOpen]);

  const filteredFavorites = useMemo(() => {
    if (!searchQuery.trim()) return favorites;
    const q = searchQuery.toLowerCase().trim();
    return favorites.filter((fav) => {
      const title = (fav.title || "").toLowerCase();
      const location = (fav.location || "").toLowerCase();
      return title.includes(q) || location.includes(q);
    });
  }, [favorites, searchQuery]);

  const usableHeight = Math.max(300, listHeight - BOTTOM_BAR_SPACE - TOP_PADDING);
  const cardSlot = Math.floor(usableHeight / 6);
  const cardHeight = Math.max(68, cardSlot - 10);
  const cardMarginBottom = cardSlot - cardHeight;
  const paddingBottom = Math.max(110, listHeight - TOP_PADDING - (cardSlot * 6));

  if (itemToDelete?.title) {
    lastItemTitleRef.current = itemToDelete.title;
  }

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      setIsDeleting(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (user && itemToDelete.title) {
        await supabase
          .from("favorites")
          .delete()
          .eq("user_id", user.id)
          .eq("title", itemToDelete.title);
      } else {
        await supabase
          .from("favorites")
          .delete()
          .eq("id", itemToDelete.id);
      }

      setFavorites((prev) =>
        prev.filter((fav) => fav.id !== itemToDelete.id && fav.title !== itemToDelete.title)
      );
      setItemToDelete(null);
    } catch (error) {
      console.error("Erro ao remover favorito:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      async function loadFavorites() {
        if (isInitialLoad.current) {
          setLoading(true);
        }
        try {
          const { data: { user } } = await supabase.auth.getUser();

          if (user) {
            const { data, error } = await supabase
              .from("favorites")
              .select("*")
              .eq("user_id", user.id);

            if (error) throw error;
            
            const uniqueFavorites = [];
            const seenKeys = new Set();
            for (const fav of (data || [])) {
              const key = (fav.title || fav.item_id || String(fav.id)).trim().toLowerCase();
              if (!seenKeys.has(key)) {
                seenKeys.add(key);
                uniqueFavorites.push(fav);
              }
            }
            setFavorites(uniqueFavorites);

            if (uniqueFavorites.length <= 6 && scrollOffsetRef.current > 0) {
              scrollOffsetRef.current = 0;
              scrollY.setValue(0);
              flatListRef.current?.scrollToOffset({ offset: 0, animated: false });
            }
          }
        } catch (error) {
          console.error("Erro ao carregar favoritos:", error);
        } finally {
          setLoading(false);
          isInitialLoad.current = false;
        }
      }

      scrollY.setValue(scrollOffsetRef.current);
      loadFavorites();
    }, [])
  );

  return (
    <View style={styles.container}>
      <ImageBackground source={bgSource} style={styles.backgroundImage} resizeMode="cover">
        <LinearGradient
          colors={["rgba(0, 0, 0, 0.50)", "rgba(0, 0, 0, 0.68)"]}
          style={styles.flex1}
        >
          <SafeAreaView style={styles.container}>
            {}
            <View
              style={styles.searchBarWrapper}
            >
              <Animated.View
                style={[styles.flex1, { opacity: titleAnim.interpolate({ inputRange: [0, 0.4, 1], outputRange: [1, 0, 0] }), transform: [{ translateX: titleAnim.interpolate({ inputRange: [0, 1], outputRange: [0, -30] }) }] }]}
                pointerEvents={isSearchOpen ? "none" : "auto"}
              >
                <Text style={[styles.headerTitle, { color: "#FFF" }]} numberOfLines={1}>
                  Favoritos
                </Text>
              </Animated.View>

              {}
              <Animated.View
                style={[
                  isDarkMode ? styles.iconButtonDark : styles.iconButtonLight,
                  {
                    position: "absolute",
                    right: 20,
                    width: searchWidthAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [44, width - 40],
                    }),
                    height: 44,
                    borderRadius: 15,
                    flexDirection: "row",
                    alignItems: "center",
                    overflow: "hidden",
                    borderWidth: isSearchOpen ? (isFocused ? 1.8 : 1.5) : 0,
                    borderColor: isSearchOpen ? currentTheme.accent : "transparent",
                  },
                ]}
              >
                {!isSearchOpen ? (
                  <TouchableOpacity
                    style={styles.searchIconBtn}
                    onPress={handleOpenSearch}
                    activeOpacity={0.75}
                  >
                    <Feather name="search" size={20} color={currentTheme.accent} />
                  </TouchableOpacity>
                ) : (
                  <View
                    style={styles.searchBarInner}
                  >
                    <Feather
                      name="search"
                      size={18}
                      color={currentTheme.accent}
                      style={styles.searchLeadingIcon}
                    />
                    <TextInput
                      ref={searchInputRef}
                      style={styles.searchInput}
                      placeholder="Buscar nos favoritos..."
                      placeholderTextColor={
                        isDarkMode
                          ? "rgba(255, 255, 255, 0.45)"
                          : "rgba(255, 255, 255, 0.65)"
                      }
                      value={searchQuery}
                      onChangeText={setSearchQuery}
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                      returnKeyType="search"
                      autoCapitalize="none"
                      autoCorrect={false}
                      selectionColor={currentTheme.accent}
                    />
                    {searchQuery.length > 0 && (
                      <TouchableOpacity
                        onPress={() => setSearchQuery("")}
                        hitSlop={{ top: 10, bottom: 10, left: 8, right: 8 }}
                        style={styles.searchActionBtn}
                      >
                        <Feather
                          name="x-circle"
                          size={16}
                          color={isDarkMode ? "rgba(255, 255, 255, 0.5)" : "rgba(255, 255, 255, 0.7)"}
                        />
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity
                      onPress={handleCloseSearch}
                      hitSlop={{ top: 10, bottom: 10, left: 8, right: 8 }}
                      style={styles.searchCloseBtn}
                    >
                      <Feather name="x" size={19} color="#FFFFFF" />
                    </TouchableOpacity>
                  </View>
                )}
              </Animated.View>
            </View>

            {loading ? (
              <FavoritesSkeletonList
                isDarkMode={isDarkMode}
                cardHeight={cardHeight}
                cardMarginBottom={cardMarginBottom}
              />
            ) : (
              <FadeInView duration={260} style={styles.flex1}>
                <Animated.FlatList
                  ref={flatListRef}
                  data={filteredFavorites}
                  keyboardShouldPersistTaps="handled"
                  showsVerticalScrollIndicator={false}
                  keyExtractor={(item) => item.id.toString()}
                  contentContainerStyle={{
                    paddingTop: TOP_PADDING,
                    paddingHorizontal: 20,
                    paddingBottom: paddingBottom,
                  }}
                  bounces={true}
                  overScrollMode="always"
                  scrollEventThrottle={16}
                  onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    {
                      useNativeDriver: true,
                      listener: (e) => {
                        scrollOffsetRef.current = e.nativeEvent.contentOffset.y;
                      },
                    }
                  )}
                  onLayout={(e) => {
                    const h = e.nativeEvent.layout.height;
                    if (h > 0) setListHeight(h);
                  }}
                  renderItem={({ item, index }) => (
                    <FavoriteCardItem
                      item={item}
                      index={index}
                      totalItems={filteredFavorites.length}
                      scrollY={scrollY}
                      cardSlot={cardSlot}
                      cardHeight={cardHeight}
                      cardMarginBottom={cardMarginBottom}
                      currentTheme={currentTheme}
                      isDarkMode={isDarkMode}
                      navigation={navigation}
                      setItemToDelete={setItemToDelete}
                    />
                  )}
                  ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                      {searchQuery.trim() ? (
                        <>
                          <Feather
                            name="search"
                            size={38}
                            color={isDarkMode ? "rgba(255, 255, 255, 0.3)" : "rgba(255, 255, 255, 0.55)"}
                            style={styles.emptyIcon}
                          />
                          <Text style={styles.emptyTitle}>
                            Nenhum resultado
                          </Text>
                          <Text
                            style={isDarkMode ? styles.emptySubtitleDark : styles.emptySubtitleLight}
                          >
                            Nenhum destino salvo corresponde a "{searchQuery}".
                          </Text>
                        </>
                      ) : (
                        <Text style={styles.whiteText}>
                          Nenhum destino salvo ainda.
                        </Text>
                      )}
                    </View>
                  }
                />
              </FadeInView>
            )}
          </SafeAreaView>
        </LinearGradient>
      </ImageBackground>

      {}
      <Modal
        visible={!!itemToDelete}
        transparent={true}
        animationType="fade"
        statusBarTranslucent={true}
        navigationBarTranslucent={true}
        onRequestClose={() => !isDeleting && setItemToDelete(null)}
      >
        <TouchableWithoutFeedback onPress={() => !isDeleting && setItemToDelete(null)}>
          <View style={dialogStyles.overlay}>
            <TouchableWithoutFeedback>
              <View
                style={[
                  dialogStyles.dialogCard,
                  !isDarkMode && {
                    backgroundColor: "rgba(100, 100, 100, 0.82)",
                    borderWidth: 0,
                    shadowColor: "transparent",
                    shadowOpacity: 0,
                    shadowRadius: 0,
                    elevation: 0,
                  },
                ]}
              >
                <View style={dialogStyles.contentSection}>
                  <Text style={dialogStyles.title}>
                    Remover dos favoritos?
                  </Text>
                  <Text style={dialogStyles.message}>
                    Deseja remover{" "}
                    <Text style={styles.boldWhiteText}>
                      "{itemToDelete?.title || lastItemTitleRef.current}"
                    </Text>{" "}
                    da sua lista de destinos salvos?
                  </Text>
                </View>

                {}
                <TouchableOpacity
                  style={dialogStyles.actionButton}
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

                {}
                <TouchableOpacity
                  style={[dialogStyles.actionButton, dialogStyles.lastButton]}
                  onPress={() => setItemToDelete(null)}
                  disabled={isDeleting}
                  activeOpacity={0.65}
                >
                  <Text style={dialogStyles.cancelText}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}
