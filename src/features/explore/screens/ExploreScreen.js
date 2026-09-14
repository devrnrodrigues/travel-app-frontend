import React, { useState, useCallback, useRef, useMemo, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
  Image,
  ActivityIndicator,
  RefreshControl,
  StatusBar,
  ImageBackground,
  Animated,
  Keyboard,
  Platform,
  } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Feather from "react-native-vector-icons/Feather";
import Ionicons from "react-native-vector-icons/Ionicons";
import { supabase } from "../../../config/supabase";
import { useTheme } from "../../../theme/ThemeContext";
import { ExploreSkeletonGrid } from "../../../shared/components/Skeleton";
import FadeInView from "../../../shared/components/FadeInView";
import styles, { GAP, COLUMN_WIDTH, categoryThemes, defaultTheme } from "../styles/explore.styles";

const PEXELS_API_KEY = process.env.EXPO_PUBLIC_PEXELS_API_KEY;

const ExploreCard = React.memo(function ExploreCard({ item, onPress, isDarkMode }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const imgAnim = useRef(new Animated.Value(0)).current;

  const handleImageLoad = () => {
    setImageLoaded(true);
    Animated.timing(imgAnim, {
      toValue: 1,
      duration: 240,
      useNativeDriver: Platform.OS !== "web",
    }).start();
  };

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      style={[styles.gridItem, { height: item.cardHeight }]}
      onPress={onPress}
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

      {}
      {item.realRating && item.realRating !== "N/A" && (
        <View style={styles.topBadge}>
          <Ionicons name="star" size={9} color="#FFD700" />
          <Text style={styles.topBadgeText}>{item.realRating}</Text>
        </View>
      )}

      {}
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
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchInputRef = useRef(null);

  const insets = useSafeAreaInsets();
  const topInset = Math.max(insets.top, Platform.OS === "android" ? 38 : 20);
  const searchBarTop = topInset + 30;

  const dismissSearchFocus = useCallback(() => {
    Keyboard.dismiss();
    searchInputRef.current?.blur();
    setIsSearchFocused(false);
  }, []);

  const searchBarAnim = useRef(new Animated.Value(0)).current; 
  const isHiddenRef = useRef(false);
  const lastScrollY = useRef(0);
  const autoHideTimerRef = useRef(null);
  const isSearchFocusedRef = useRef(false);

  const hideSearchBar = useCallback(() => {
    if (isSearchFocusedRef.current || isHiddenRef.current) return;
    if (autoHideTimerRef.current) {
      clearTimeout(autoHideTimerRef.current);
      autoHideTimerRef.current = null;
    }
    isHiddenRef.current = true;
    Animated.timing(searchBarAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [searchBarAnim]);

  const scheduleAutoHide = useCallback(() => {
    if (autoHideTimerRef.current) {
      clearTimeout(autoHideTimerRef.current);
      autoHideTimerRef.current = null;
    }
    if (!isSearchFocusedRef.current && !isHiddenRef.current) {
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
    if (isHiddenRef.current) {
      isHiddenRef.current = false;
      Animated.spring(searchBarAnim, {
        toValue: 0,
        useNativeDriver: true,
        bounciness: 0,
        speed: 20,
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
    scheduleAutoHide();
    return () => {
      if (autoHideTimerRef.current) {
        clearTimeout(autoHideTimerRef.current);
        autoHideTimerRef.current = null;
      }
    };
  }, [scheduleAutoHide]);

  const handleScroll = useCallback((event) => {
    const currentY = event.nativeEvent.contentOffset.y;
    const diff = currentY - lastScrollY.current;

    if (currentY <= 20) {
      if (isHiddenRef.current) {
        showSearchBar();
      }
    } else if (diff > 18 && !isHiddenRef.current && currentY > 50) {
      
      if (!isSearchFocusedRef.current) {
        hideSearchBar();
      }
    } else if (diff < -15 && isHiddenRef.current) {
      
      showSearchBar();
    }

    lastScrollY.current = currentY;
  }, [hideSearchBar, showSearchBar]);

  const searchTranslateY = searchBarAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -(searchBarTop + 75)],
  });

  const searchOpacity = searchBarAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });

  const loadAllDestinations = async () => {
    try {
      const { data, error } = await supabase
        .from("destinos")
        .select("*, reviews(rating), price");

      if (error) throw error;

      const updated = await Promise.all(
        (data || []).map(async (destination) => {
          let calculatedRating = "N/A";
          if (destination.reviews && destination.reviews.length > 0) {
            const total = destination.reviews.reduce(
              (sum, r) => sum + Number(r.rating),
              0
            );
            calculatedRating = (total / destination.reviews.length).toFixed(1);
          }

          const sanitizedTitle = destination.title
            .toLowerCase()
            .replace(/[^a-z0-9]/g, "");
          const cacheKey = `@pexels_img_${destination.id}_${sanitizedTitle}`;

          try {
            const cachedImg = await AsyncStorage.getItem(cacheKey);
            if (cachedImg !== null) {
              return {
                ...destination,
                realRating: calculatedRating,
                image_url: cachedImg,
              };
            }

            const queryText = `${destination.title} ${destination.category || ""}`.trim();
            const pexelsResponse = await fetch(
              `https://api.pexels.com/v1/search?query=${encodeURIComponent(
                queryText
              )}&per_page=1`,
              { headers: { Authorization: PEXELS_API_KEY } }
            );

            if (pexelsResponse.ok) {
              const pexelsData = await pexelsResponse.json();
              if (pexelsData.photos && pexelsData.photos.length > 0) {
                const imgUrl = pexelsData.photos[0].src.large;
                await AsyncStorage.setItem(cacheKey, imgUrl);
                return {
                  ...destination,
                  realRating: calculatedRating,
                  image_url: imgUrl,
                };
              }
            }
          } catch (err) {
            
          }

          return {
            ...destination,
            realRating: calculatedRating,
            image_url:
              destination.image_url && destination.image_url.startsWith("http")
                ? destination.image_url
                : "https://images.pexels.com/photos/1007657/pexels-photo-1007657.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
          };
        })
      );

      setDestinations(updated);
    } catch (err) {
      console.error("Erro ao carregar destinos em Explorar:", err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadAllDestinations();
      showSearchBar();
      return () => {
        if (autoHideTimerRef.current) {
          clearTimeout(autoHideTimerRef.current);
          autoHideTimerRef.current = null;
        }
      };
    }, [showSearchBar])
  );

  const handleRefresh = () => {
    setRefreshing(true);
    loadAllDestinations();
  };

  const filteredDestinations = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (query === "") return destinations;

    return destinations.filter((item) => (
      item.title?.toLowerCase().includes(query) ||
      item.location?.toLowerCase().includes(query) ||
      item.category?.toLowerCase().includes(query)
    ));
  }, [destinations, searchQuery]);

  const HEIGHT_FACTORS = [
    1.65, 0.95, 1.35, 1.80, 1.10, 1.50, 0.85, 1.70, 1.25, 1.00, 1.55, 1.15,
    1.40, 0.90, 1.75, 1.20, 1.60, 1.05, 1.45, 0.95, 1.30, 1.65, 1.10, 1.50
  ];

  const { col1, col2, col3 } = useMemo(() => {
    const c1 = [];
    const c2 = [];
    const c3 = [];
    const colHeights = [0, 0, 0];

    filteredDestinations.forEach((item, index) => {
      const idNum = typeof item.id === "number"
        ? item.id
        : String(item.id || index).split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);

      const factorIndex = (idNum * 13 + index * 17) % HEIGHT_FACTORS.length;
      const cardHeight = Math.round(COLUMN_WIDTH * HEIGHT_FACTORS[factorIndex]);
      const cardItem = { ...item, cardHeight };

      let shortestCol = 0;
      if (colHeights[1] < colHeights[shortestCol]) shortestCol = 1;
      if (colHeights[2] < colHeights[shortestCol]) shortestCol = 2;

      if (shortestCol === 0) {
        c1.push(cardItem);
      } else if (shortestCol === 1) {
        c2.push(cardItem);
      } else {
        c3.push(cardItem);
      }

      colHeights[shortestCol] += cardHeight + GAP;
    });

    return { col1: c1, col2: c2, col3: c3 };
  }, [filteredDestinations]);

  const handleCardPress = useCallback((item) => {
    const itemTheme = categoryThemes[item.category] || defaultTheme;
    navigation.navigate("Details", {
      item,
      currentTheme: itemTheme,
    });
  }, [navigation]);

  return (
    <ImageBackground source={bgSource} style={styles.screenDarkBg} resizeMode="cover">
      <LinearGradient
        colors={["rgba(10, 10, 10, 0.72)", "rgba(5, 5, 5, 0.88)"]}
        style={styles.flex1}
      >
        <View style={styles.container}>
          <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

          {}
          {loading ? (
            <ScrollView
              contentContainerStyle={styles.masonryContainer}
              showsVerticalScrollIndicator={false}
              scrollEnabled={false}
            >
              <ExploreSkeletonGrid isDarkMode={isDarkMode} currentTheme={currentTheme} />
            </ScrollView>
          ) : (
            <FadeInView duration={280} style={styles.flex1}>
              <ScrollView
                contentContainerStyle={styles.masonryContainer}
                showsVerticalScrollIndicator={false}
                onScroll={handleScroll}
                onScrollBeginDrag={dismissSearchFocus}
                keyboardDismissMode="on-drag"
                keyboardShouldPersistTaps="handled"
                scrollEventThrottle={32}
                removeClippedSubviews={Platform.OS === "android"}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                    tintColor={currentTheme?.accent || "#4CAF50"}
                    colors={[currentTheme?.accent || "#4CAF50"]}
                  />
                }
              >
                {filteredDestinations.length === 0 ? (
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
                ) : (
                  <View style={styles.masonryRow}>
                    <View style={styles.masonryColumn}>
                      {col1.map((item) => (
                        <ExploreCard
                          key={String(item.id)}
                          item={item}
                          isDarkMode={isDarkMode}
                          onPress={() => handleCardPress(item)}
                        />
                      ))}
                    </View>
                    <View style={styles.masonryColumn}>
                      {col2.map((item) => (
                        <ExploreCard
                          key={String(item.id)}
                          item={item}
                          isDarkMode={isDarkMode}
                          onPress={() => handleCardPress(item)}
                        />
                      ))}
                    </View>
                    <View style={styles.masonryColumn}>
                      {col3.map((item) => (
                        <ExploreCard
                          key={String(item.id)}
                          item={item}
                          isDarkMode={isDarkMode}
                          onPress={() => handleCardPress(item)}
                        />
                      ))}
                    </View>
                  </View>
                )}
              </ScrollView>
            </FadeInView>
          )}

          {}
          <Animated.View
            pointerEvents={isSearchFocused || !isHiddenRef.current ? "auto" : "none"}
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
            <TouchableWithoutFeedback onPress={() => searchInputRef.current?.focus()}>
              <View style={styles.searchBarInner}>
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
              </View>
            </TouchableWithoutFeedback>
          </Animated.View>
        </View>
      </LinearGradient>
    </ImageBackground>
  );
}
