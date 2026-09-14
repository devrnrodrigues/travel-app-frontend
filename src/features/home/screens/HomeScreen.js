import React, { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { View, Text, ScrollView, Image, TouchableOpacity, FlatList, Dimensions, StatusBar, ActivityIndicator, ImageBackground, Modal, TextInput, Animated, Keyboard, TouchableWithoutFeedback, StyleSheet, PanResponder, Easing, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Feather from "react-native-vector-icons/Feather";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import styles, { countryModalStyles } from "../styles/home.styles";
import { supabase } from "../../../config/supabase";
import { useTheme } from "../../../theme/ThemeContext";
import { HomeSkeletonList, SearchSkeletonList, SkeletonBox } from "../../../shared/components/Skeleton";
import FadeInView from "../../../shared/components/FadeInView";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.75;
const SCREEN_HEIGHT = Dimensions.get("screen").height;
const PEXELS_API_KEY = process.env.EXPO_PUBLIC_PEXELS_API_KEY;

const POPULAR_COUNTRIES = [
  "Todos os países",
  "Brasil",
  "Estados Unidos",
  "França",
  "Itália",
  "Japão",
  "Espanha",
  "Grécia",
  "Tailândia",
  "Portugal",
  "Suíça",
  "Argentina",
  "Indonésia",
  "Egito",
  "Reino Unido",
  "Canadá",
];

const parsePrice = (price) => {
  if (price === null || price === undefined || price === "") return null;
  if (typeof price === "number") return isNaN(price) ? null : price;
  const cleaned = String(price).replace(/[^0-9.-]+/g, "");
  const num = parseFloat(cleaned);
  return isNaN(num) ? null : num;
};

const parseRating = (rating) => {
  if (rating === null || rating === undefined || rating === "N/A" || rating === "") return 0;
  const num = parseFloat(rating);
  return isNaN(num) ? 0 : num;
};

const SearchCardItem = React.memo(function SearchCardItem({
  item,
  cardHeight,
  cardMarginBottom,
  currentTheme,
  isDarkMode,
  isOverlayActive,
  showPrice,
  showRating,
  onPress,
}) {
  const isLocal = item.isLocalSource || typeof item.image_url !== "string";
  const [imageLoaded, setImageLoaded] = useState(isLocal);
  const imgAnim = useRef(new Animated.Value(isLocal ? 1 : 0)).current;
  const imageSize = Math.max(48, cardHeight - 20);

  const handleImageLoad = () => {
    setImageLoaded(true);
    Animated.timing(imgAnim, {
      toValue: 1,
      duration: 220,
      useNativeDriver: Platform.OS !== "web",
    }).start();
  };

  return (
    <View style={styles.flex1}>
      <TouchableOpacity
        activeOpacity={0.85}
        style={[styles.searchCardBase, !isDarkMode ? styles.searchCardLight : styles.searchCardDark, { height: cardHeight, marginBottom: cardMarginBottom }]}
        onPress={onPress}>
        <View
          style={[styles.searchCardImageWrapper, { width: imageSize, height: imageSize }]}
        >
          <Animated.Image
            source={item.isLocalSource || typeof item.image_url !== "string" ? item.image_url : { uri: item.image_url }}
            style={[{ width: imageSize, height: imageSize, borderRadius: 13, opacity: imgAnim }]}
            onLoad={handleImageLoad}
          />
          {!imageLoaded && (
            <SkeletonBox
              width={imageSize}
              height={imageSize}
              borderRadius={13}
              isDarkMode={isDarkMode}
              style={isDarkMode ? styles.searchCardSkeletonDark : styles.searchCardSkeletonLight}
            />
          )}
        </View>

        <View style={styles.searchCardInfo}>
          <Text
            style={[styles.searchCardTitle, { paddingRight: (showPrice || showRating) ? 72 : 0 }]}
            numberOfLines={1}
          >
            {item.title}
          </Text>

          <View style={styles.searchCardLocationRow}>
            <Feather name="map-pin" size={12} color={currentTheme.accent} />
            <Text style={styles.searchCardLocationText} numberOfLines={1}>
              {item.location}
            </Text>
          </View>
        </View>

        {((showPrice && item.price != null) || showRating) && (
          <View
            style={styles.searchCardBadgesContainer}
          >
            {showPrice && item.price != null && (
              <View
                style={[styles.searchCardPriceBadge, { marginRight: showRating ? 5 : 0 }]}
              >
                <Text style={[styles.searchCardBadgeText, { color: currentTheme.accent }]}>
                  R$ {item.price}
                </Text>
              </View>
            )}
            {showRating && (
              <View
                style={styles.searchCardRatingBadge}
              >
                <Ionicons name="star" size={11} color="#FFD700" style={styles.marginRight3} />
                <Text style={styles.searchCardRatingText}>
                  {item.realRating || "4.8"}
                </Text>
              </View>
            )}
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
});

const CategoryTabItem = React.memo(function CategoryTabItem({
  cat,
  index,
  isActive,
  accentColor,
  iconName,
  onPress,
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
      activeOpacity={0.75}
    >
      <View style={styles.centerAligned}>
        <View style={styles.rowCenter}>
          <Text
            style={[
              styles.categoryText,
              { color: isActive ? accentColor : "#FFF" },
              isActive && styles.categoryTextActive,
            ]}
          >
            {cat}
          </Text>
          {isActive && (
            <MaterialCommunityIcons
              name={iconName}
              size={18}
              color={accentColor}
              style={styles.marginLeft5}
            />
          )}
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

const HomeCardItem = React.memo(function HomeCardItem({
  item,
  currentTheme,
  isDarkMode,
  navigation,
}) {
  const isLocal = item.isLocalSource || typeof item.image_url !== "string";
  const [imageLoaded, setImageLoaded] = useState(isLocal);
  const imgAnim = useRef(new Animated.Value(isLocal ? 1 : 0)).current;

  const cardImgSource = isLocal
    ? (item.image_url || currentTheme.bg)
    : { uri: item.image_url };

  const handleImageLoad = () => {
    setImageLoaded(true);
    Animated.timing(imgAnim, {
      toValue: 1,
      duration: 260,
      useNativeDriver: Platform.OS !== "web",
    }).start();
  };

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={styles.card}
      onPress={() => navigation.navigate("Details", { item, currentTheme })}
    >
      <Animated.Image
        source={cardImgSource}
        style={[styles.cardImage, { opacity: imgAnim }]}
        onLoad={handleImageLoad}
      />
      <View
        style={[
          styles.cardInfo,
          {
            backgroundColor: "transparent",
            borderWidth: 0,
            shadowColor: "transparent",
            shadowOpacity: 0,
            shadowRadius: 0,
            elevation: 0,
            overflow: "hidden",
            paddingHorizontal: 0,
            paddingVertical: 0,
          },
        ]}
      >
        {}
        {Platform.OS === "android" && !isDarkMode && (
          <Image
            source={cardImgSource}
            blurRadius={3}
            style={styles.cardFullBackground}
          />
        )}

        {}
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: !isDarkMode
                ? "rgba(100, 100, 100, 0.40)"
                : "rgba(12, 12, 12, 0.82)",
              borderRadius: 25,
            },
          ]}
        />

        {}
        {Platform.OS !== "android" && !isDarkMode && (
          <BlurView
            intensity={16}
            tint="light"
            style={styles.cardOverlayImage}
          />
        )}

        <View
          style={styles.cardInfoInner}
        >
          <View style={styles.cardInfoLeft}>
            <Text
              style={[styles.cardTitle, !isDarkMode && { color: "#FFFFFF" }]}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {item.title}
            </Text>
            <Text
              style={[styles.cardLocation, !isDarkMode && { color: "rgba(255, 255, 255, 0.85)" }]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {item.location}
            </Text>
          </View>
          <View
            style={[
              styles.ratingContainer,
              !isDarkMode && styles.cardInfoLightBg,
            ]}
          >
            <Ionicons name="star" size={14} color={currentTheme.accent} />
            <Text style={[styles.ratingText, { color: currentTheme.accent, fontWeight: "700" }]}>
              {item.realRating}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
});

export default function Home({ navigation }) {
  const { activeCat, setActiveCat, currentTheme, themesByCat, isDarkMode } = useTheme();
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [alphaSort, setAlphaSort] = useState(null);
  const [priceSort, setPriceSort] = useState(null);
  const [ratingSort, setRatingSort] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [isCountryModalVisible, setIsCountryModalVisible] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchFocusAnim = useRef(new Animated.Value(0)).current;
  const searchInputRef = useRef(null);

  const handleSearchFocus = useCallback(() => {
    setIsSearchFocused(true);
    Animated.timing(searchFocusAnim, {
      toValue: 1,
      duration: 200,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();
  }, [searchFocusAnim]);

  const handleSearchBlur = useCallback(() => {
    setIsSearchFocused(false);
    Animated.timing(searchFocusAnim, {
      toValue: 0,
      duration: 200,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();
  }, [searchFocusAnim]);

  const dismissSearchFocus = useCallback(() => {
    Keyboard.dismiss();
    searchInputRef.current?.blur();
    handleSearchBlur();
  }, [handleSearchBlur]);

  const countryModalSlideAnim = useRef(new Animated.Value(400)).current;
  const searchSlideAnim = useRef(new Animated.Value(-SCREEN_HEIGHT)).current;
  const searchFadeAnim = useRef(new Animated.Value(0)).current;
  const filterAnim = useRef(new Animated.Value(0)).current;
  const isClosingSearch = useRef(false);
  const isKeyboardVisible = useRef(false);

  const filterIconRotate = filterAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "90deg"],
  });

  const filterIconScale = filterAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 0.85, 1],
  });

  const toggleFilter = useCallback(() => {
    dismissSearchFocus();
    if (isFilterVisible) {
      Animated.timing(filterAnim, {
        toValue: 0,
        duration: 200,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        useNativeDriver: false,
      }).start(() => {
        setIsFilterVisible(false);
      });
    } else {
      setIsFilterVisible(true);
      filterAnim.setValue(0);
      Animated.spring(filterAnim, {
        toValue: 1,
        damping: 20,
        stiffness: 220,
        mass: 0.8,
        useNativeDriver: false,
      }).start();
    }
  }, [isFilterVisible, filterAnim, dismissSearchFocus]);

  useEffect(() => {
    const showSub = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      () => {
        isKeyboardVisible.current = true;
      }
    );
    const hideSub = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      () => {
        isKeyboardVisible.current = false;
      }
    );

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  useEffect(() => {
    if (isSearchVisible) {
      searchSlideAnim.setValue(-SCREEN_HEIGHT);
      searchFadeAnim.setValue(0);
      Animated.parallel([
        Animated.spring(searchSlideAnim, {
          toValue: 0,
          damping: 24,
          stiffness: 200,
          mass: 0.8,
          useNativeDriver: true,
        }),
        Animated.timing(searchFadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();

      const focusTimer = setTimeout(() => {
        if (!isClosingSearch.current) {
          searchInputRef.current?.focus();
        }
      }, 180);

      return () => clearTimeout(focusTimer);
    }
  }, [isSearchVisible, searchSlideAnim, searchFadeAnim]);

  const handleOpenSearch = useCallback(() => {
    if (isClosingSearch.current) return;
    setIsSearchVisible(true);
  }, []);

  const handleCloseSearch = useCallback(() => {
    if (isClosingSearch.current) return;
    isClosingSearch.current = true;

    const keyboardWasOpen = isKeyboardVisible.current || isSearchFocused;
    Keyboard.dismiss();

    let finishedAnim = false;
    let finishedKeyboard = !keyboardWasOpen;

    const finalizeClose = () => {
      if (finishedAnim && finishedKeyboard) {
        setIsSearchVisible(false);
        setIsSearchFocused(false);
        setIsFilterVisible(false);
        filterAnim.setValue(0);
        searchInputRef.current?.blur();
        isClosingSearch.current = false;
      }
    };

    let hideListener = null;
    let fallbackTimeout = null;

    if (keyboardWasOpen) {
      hideListener = Keyboard.addListener(
        Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
        () => {
          hideListener?.remove();
          hideListener = null;
          if (fallbackTimeout) clearTimeout(fallbackTimeout);
          finishedKeyboard = true;
          finalizeClose();
        }
      );

      fallbackTimeout = setTimeout(() => {
        hideListener?.remove();
        hideListener = null;
        finishedKeyboard = true;
        finalizeClose();
      }, 300);
    }

    Animated.parallel([
      Animated.timing(searchSlideAnim, {
        toValue: -SCREEN_HEIGHT,
        duration: 280,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        useNativeDriver: true,
      }),
      Animated.timing(searchFadeAnim, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start(() => {
      finishedAnim = true;
      finalizeClose();
    });
  }, [searchSlideAnim, searchFadeAnim, isSearchFocused]);

  useEffect(() => {
    if (isCountryModalVisible) {
      countryModalSlideAnim.setValue(400);
      Animated.spring(countryModalSlideAnim, {
        toValue: 0,
        damping: 24,
        stiffness: 220,
        useNativeDriver: true,
      }).start();
    }
  }, [isCountryModalVisible, countryModalSlideAnim]);

  const handleCloseCountryModal = useCallback(() => {
    Animated.timing(countryModalSlideAnim, {
      toValue: 400,
      duration: 180,
      useNativeDriver: true,
    }).start(() => {
      setIsCountryModalVisible(false);
    });
  }, [countryModalSlideAnim]);

  const countryPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return gestureState.dy > 5;
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          countryModalSlideAnim.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 100 || gestureState.vy > 0.5) {
          handleCloseCountryModal();
        } else {
          Animated.spring(countryModalSlideAnim, {
            toValue: 0,
            damping: 24,
            stiffness: 220,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  const countriesList = useMemo(() => {
    const list = [...POPULAR_COUNTRIES];
    const existing = new Set(list.map((c) => c.toLowerCase()));
    for (const d of destinations) {
      if (d.location) {
        const parts = d.location.split(",");
        const lastPart = parts[parts.length - 1]?.trim();
        if (lastPart && !existing.has(lastPart.toLowerCase())) {
          existing.add(lastPart.toLowerCase());
          list.push(lastPart);
        }
      }
    }
    return list;
  }, [destinations]);

  const searchScrollY = useRef(new Animated.Value(0)).current;
  const searchFlatListRef = useRef(null);

  const windowHeight = Dimensions.get("window").height;
  const baseSearchHeight = Math.max(500, windowHeight - 150);
  const searchCardSlot = Math.floor(baseSearchHeight / 6);
  const searchCardHeight = Math.max(72, searchCardSlot - 10);
  const searchCardMarginBottom = Math.max(8, searchCardSlot - searchCardHeight);

  useEffect(() => {
    searchScrollY.setValue(0);
    if (searchFlatListRef.current) {
      try {
        searchFlatListRef.current.scrollToOffset({ offset: 0, animated: false });
      } catch (_) { }
    }
  }, [isSearchVisible, searchQuery, alphaSort, priceSort, ratingSort, selectedCountry]);

  const CATEGORIES = ["Florestas", "Praias", "Montanhas", "Cachoeiras", "Deserto", "Neve", "Histórico", "Urbano", "Ilhas", "Interior"];

  const prevCatRef = useRef(activeCat);

  const loadData = async (catIndex = activeCat, showSpinner = false) => {
    if (showSpinner) {
      setLoading(true);
    }
    try {
      const selectedCategory = CATEGORIES[catIndex];
      const { data, error } = await supabase
        .from('destinos')
        .select('*, reviews(rating), price')
        .eq('category', selectedCategory);

      if (error) throw error;

      const selectedTheme = themesByCat[catIndex];
      const updatedDestinations = await Promise.all((data || []).map(async (destination) => {

        let calculatedRating = "N/A";
        if (destination.reviews && destination.reviews.length > 0) {
          const total = destination.reviews.reduce((sum, r) => sum + Number(r.rating), 0);
          calculatedRating = (total / destination.reviews.length).toFixed(1);
        }

        const sanitizedTitle = destination.title.toLowerCase().replace(/[^a-z0-9]/g, "");
        const cacheKey = `@pexels_img_${destination.id}_${sanitizedTitle}`;

        try {
          const cachedImg = await AsyncStorage.getItem(cacheKey);
          if (cachedImg !== null) {
            return { ...destination, realRating: calculatedRating, image_url: cachedImg, isLocalSource: false };
          }
          const queryText = `${destination.title} ${selectedCategory}`.trim();
          const pexelsResponse = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(queryText)}&per_page=1`, { headers: { Authorization: PEXELS_API_KEY } });
          if (!pexelsResponse.ok) throw new Error(`HTTP Error ${pexelsResponse.status}`);
          const pexelsData = await pexelsResponse.json();
          if (pexelsData.photos && pexelsData.photos.length > 0) {
            const imgUrl = pexelsData.photos[0].src.large;
            await AsyncStorage.setItem(cacheKey, imgUrl);
            return { ...destination, realRating: calculatedRating, image_url: imgUrl, isLocalSource: false };
          }
        } catch (imgError) { console.warn(imgError.message); }

        if (destination.image_url && destination.image_url.startsWith('http')) {
          return { ...destination, realRating: calculatedRating, isLocalSource: false };
        }
        return { ...destination, realRating: calculatedRating, image_url: selectedTheme.bg, isLocalSource: typeof selectedTheme.bg !== 'string' };
      }));

      setDestinations(updatedDestinations);
    } catch (error) { console.error(error.message); } finally { setLoading(false); }
  };

  useFocusEffect(
    useCallback(() => {
      const catChanged = prevCatRef.current !== activeCat;
      prevCatRef.current = activeCat;
      loadData(activeCat, catChanged || destinations.length === 0);
    }, [activeCat, destinations.length])
  );

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

  const filteredData = useMemo(() => {
    return [...destinations]
      .filter((item) => {
        const matchesSearch =
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.location && item.location.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesCountry = selectedCountry
          ? item.location && item.location.toLowerCase().includes(selectedCountry.toLowerCase())
          : true;
        return matchesSearch && matchesCountry;
      })
      .sort((a, b) => {
        if (alphaSort === "asc") return (a.title || "").localeCompare(b.title || "");
        if (alphaSort === "desc") return (b.title || "").localeCompare(a.title || "");

        if (priceSort === "asc") {
          const pA = parsePrice(a.price);
          const pB = parsePrice(b.price);
          if (pA === null && pB === null) return 0;
          if (pA === null) return 1;
          if (pB === null) return -1;
          return pA - pB;
        }
        if (priceSort === "desc") {
          const pA = parsePrice(a.price);
          const pB = parsePrice(b.price);
          if (pA === null && pB === null) return 0;
          if (pA === null) return 1;
          if (pB === null) return -1;
          return pB - pA;
        }

        if (ratingSort === "desc") {
          const rA = parseRating(a.realRating);
          const rB = parseRating(b.realRating);
          return rB - rA;
        }
        if (ratingSort === "asc") {
          const rA = parseRating(a.realRating);
          const rB = parseRating(b.realRating);
          return rA - rB;
        }

        return 0;
      });
  }, [destinations, searchQuery, selectedCountry, alphaSort, priceSort, ratingSort]);
  return (
    <View style={styles.blackScreen}>
      <Modal
        visible={isSearchVisible}
        animationType="none"
        transparent={true}
        statusBarTranslucent={true}
        navigationBarTranslucent={true}
        onRequestClose={handleCloseSearch}
      >
        <View style={styles.transparentFlex}>
          {}
          <Animated.View
            style={[
              StyleSheet.absoluteFillObject,
              { opacity: searchFadeAnim }
            ]}
            pointerEvents="none"
          >
            <ImageBackground
              source={bgSource}
              blurRadius={10}
              style={styles.screenCover}
              resizeMode="cover"
            >
              <LinearGradient
                colors={["rgba(0, 0, 0, 0.55)", "transparent", "rgba(0, 0, 0, 0.75)"]}
                locations={[0, 0.45, 1]}
                style={styles.screenCover}
              />
              <View
                style={!isDarkMode ? styles.screenCoverLight : styles.screenCoverDark}
              />
            </ImageBackground>
          </Animated.View>

          <StatusBar barStyle="light-content" translucent={true} backgroundColor="transparent" />
          <Animated.View style={[styles.flex1, { transform: [{ translateY: searchSlideAnim }] }]}>
            <SafeAreaView style={styles.searchContainer}>

              <View style={styles.searchHeaderRow}>
                <TouchableOpacity onPress={toggleFilter} style={styles.searchBackBtn}>
                  <Animated.View style={[{ transform: [{ rotate: filterIconRotate }, { scale: filterIconScale }] }]}>
                    <Feather name="sliders" size={24} color={isFilterVisible ? currentTheme.accent : "#FFF"} />
                  </Animated.View>
                </TouchableOpacity>
                <Animated.View style={[styles.searchInputBox, { borderColor: searchFocusAnim.interpolate({ inputRange: [0, 1], outputRange: ["transparent", currentTheme.accent] }), backgroundColor: searchFocusAnim.interpolate({ inputRange: [0, 1], outputRange: !isDarkMode ? ["rgba(100, 100, 100, 0.82)", "rgba(100, 100, 100, 1)"] : ["rgba(20, 20, 20, 0.75)", "rgba(10, 10, 10, 0.85)"] }), justifyContent: "center" }]}>
                  <TextInput
                    ref={searchInputRef}
                    underlineColorAndroid="transparent"
                    style={styles.searchInput}
                    placeholder="Pesquisar destinos..."
                    placeholderTextColor={
                      !isDarkMode
                        ? "rgba(255, 255, 255, 0.65)"
                        : isSearchFocused
                          ? "rgba(255, 255, 255, 0.65)"
                          : "#FFF"
                    }
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    onFocus={handleSearchFocus}
                    onBlur={handleSearchBlur}
                  />
                </Animated.View>
                <TouchableOpacity onPress={handleCloseSearch} style={styles.marginLeft15}>
                  <Feather name="x" size={24} color="#FFF" />
                </TouchableOpacity>
              </View>

              <Animated.View style={[{ height: filterAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 50] }), marginBottom: filterAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 15] }), opacity: filterAnim.interpolate({ inputRange: [0, 0.2, 1], outputRange: [0, 0.4, 1] }), transform: [{ translateY: filterAnim.interpolate({ inputRange: [0, 1], outputRange: [-14, 0] }) }], overflow: "hidden" }]}>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  onScrollBeginDrag={dismissSearchFocus}
                  keyboardShouldPersistTaps="handled"
                  contentContainerStyle={styles.filterCategoriesContent}
                  style={styles.searchFilterRow}
                >
                  {}
                  <TouchableOpacity
                    onPress={() => {
                      dismissSearchFocus();
                      setPriceSort(null);
                      setRatingSort(null);
                      if (alphaSort === null) setAlphaSort("asc");
                      else if (alphaSort === "asc") setAlphaSort("desc");
                      else setAlphaSort(null);
                    }}
                    activeOpacity={0.75}
                    style={[styles.filterBtnBase, alphaSort ? { backgroundColor: currentTheme.accent } : styles.filterBtnInactive]}
                  >
                    <Text style={alphaSort ? styles.filterBtnActiveText : styles.filterBtnInactiveText}>
                      {alphaSort === "asc" ? "A-Z ↓" : alphaSort === "desc" ? "Z-A ↑" : "A-Z ⇅"}
                    </Text>
                  </TouchableOpacity>

                  {}
                  <TouchableOpacity
                    onPress={() => {
                      dismissSearchFocus();
                      setIsCountryModalVisible(true);
                    }}
                    activeOpacity={0.75}
                    style={[styles.filterBtnBase, selectedCountry ? { backgroundColor: currentTheme.accent } : styles.filterBtnInactive]}
                  >
                    <Feather
                      name="globe"
                      size={14}
                      color={selectedCountry ? "#000" : "#FFF"}
                      style={styles.marginRight6}
                    />
                    <Text style={selectedCountry ? styles.filterBtnActiveText : styles.filterBtnInactiveText}>
                      {selectedCountry || "Países"}
                    </Text>
                    {selectedCountry ? (
                      <TouchableOpacity
                        onPress={(e) => {
                          e.stopPropagation();
                          setSelectedCountry(null);
                        }}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        style={styles.marginLeft6}
                      >
                        <Feather name="x" size={14} color="#000" />
                      </TouchableOpacity>
                    ) : null}
                  </TouchableOpacity>

                  {}
                  <TouchableOpacity
                    onPress={() => {
                      dismissSearchFocus();
                      setAlphaSort(null);
                      setRatingSort(null);
                      if (priceSort === null) setPriceSort("asc");
                      else if (priceSort === "asc") setPriceSort("desc");
                      else setPriceSort(null);
                    }}
                    activeOpacity={0.75}
                    style={[styles.filterBtnBase, priceSort ? { backgroundColor: currentTheme.accent } : styles.filterBtnInactive]}
                  >
                    <Text style={priceSort ? styles.filterBtnActiveText : styles.filterBtnInactiveText}>
                      {priceSort === "asc" ? "Preço ↑" : priceSort === "desc" ? "Preço ↓" : "Preço ↑↓"}
                    </Text>
                  </TouchableOpacity>

                  {}
                  <TouchableOpacity
                    onPress={() => {
                      dismissSearchFocus();
                      setAlphaSort(null);
                      setPriceSort(null);
                      if (ratingSort === null) setRatingSort("desc");
                      else if (ratingSort === "desc") setRatingSort("asc");
                      else setRatingSort(null);
                    }}
                    activeOpacity={0.75}
                    style={[styles.filterBtnBase, styles.marginRight20, ratingSort ? { backgroundColor: currentTheme.accent } : styles.filterBtnInactive]}
                  >
                    <Ionicons
                      name="star"
                      size={13}
                      color={ratingSort ? "#000" : "#FFF"}
                      style={styles.marginRight6}
                    />
                    <Text style={ratingSort ? styles.filterBtnActiveText : styles.filterBtnInactiveText}>
                      {ratingSort === "desc" ? "Avaliações ↓" : ratingSort === "asc" ? "Avaliações ↑" : "Avaliações ↑↓"}
                    </Text>
                  </TouchableOpacity>
                </ScrollView>
              </Animated.View>

              {loading ? (
                <SearchSkeletonList
                  isDarkMode={isDarkMode}
                  cardHeight={searchCardHeight}
                  cardMarginBottom={searchCardMarginBottom}
                  count={6}
                />
              ) : (
                <FadeInView duration={240} style={styles.searchListWrapper}>
                  <Animated.FlatList
                    ref={searchFlatListRef}
                    data={filteredData}
                    extraData={[alphaSort, priceSort, ratingSort, selectedCountry, currentTheme, isDarkMode]}
                    keyExtractor={(item) => item.id.toString()}
                    showsVerticalScrollIndicator={false}
                    removeClippedSubviews={false}
                    initialNumToRender={12}
                    maxToRenderPerBatch={12}
                    windowSize={10}
                    onScrollBeginDrag={dismissSearchFocus}
                    keyboardDismissMode="on-drag"
                    keyboardShouldPersistTaps="handled"
                    scrollEventThrottle={16}
                    onScroll={Animated.event(
                      [{ nativeEvent: { contentOffset: { y: searchScrollY } } }],
                      { useNativeDriver: true }
                    )}
                    style={styles.flex1}
                    contentContainerStyle={{
                      paddingHorizontal: 20,
                      paddingTop: 6,
                      paddingBottom: 280,
                    }}
                    bounces={true}
                    overScrollMode="always"
                    renderItem={({ item }) => (
                      <SearchCardItem
                        item={item}
                        cardHeight={searchCardHeight}
                        cardMarginBottom={searchCardMarginBottom}
                        currentTheme={currentTheme}
                        isDarkMode={isDarkMode}
                        isOverlayActive={isCountryModalVisible}
                        showPrice={Boolean(priceSort)}
                        showRating={Boolean(ratingSort)}
                        onPress={() => {
                          isClosingSearch.current = false;
                          Keyboard.dismiss();
                          setIsSearchVisible(false);
                          navigation.navigate("Details", { item, currentTheme });
                        }}
                      />
                    )}
                    ListEmptyComponent={
                      <View style={styles.searchEmptyContainer}>
                        <Text style={styles.whiteText}>
                          Nenhum destino encontrado.
                        </Text>
                      </View>
                    }
                  />
                </FadeInView>
              )}
            </SafeAreaView>
          </Animated.View>

          {}
          <Modal
            visible={isCountryModalVisible}
            transparent={true}
            animationType="fade"
            statusBarTranslucent={true}
            navigationBarTranslucent={true}
            onRequestClose={handleCloseCountryModal}
          >
            <TouchableWithoutFeedback onPress={handleCloseCountryModal}>
              <View style={countryModalStyles.overlay}>
                <TouchableWithoutFeedback>
                  <Animated.View
                    style={[
                      countryModalStyles.sheet,
                      {
                        transform: [{ translateY: countryModalSlideAnim }],
                      },
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
                    <View {...countryPanResponder.panHandlers} style={countryModalStyles.dragHandleArea}>
                      <View style={countryModalStyles.indicator} />
                      <View style={countryModalStyles.header}>
                        <View>
                          <Text style={countryModalStyles.title}>Filtrar por País</Text>
                          <Text style={countryModalStyles.subtitle}>Escolha um destino pelo mundo</Text>
                        </View>
                      </View>
                    </View>

                    <ScrollView
                      showsVerticalScrollIndicator={false}
                      style={styles.countryListScroll}
                    >
                      {countriesList.map((countryName) => {
                        const isSelected =
                          (!selectedCountry && countryName === "Todos os países") ||
                          selectedCountry === countryName;
                        return (
                          <TouchableOpacity
                            key={countryName}
                            onPress={() => {
                              if (countryName === "Todos os países") {
                                setSelectedCountry(null);
                              } else {
                                setSelectedCountry(countryName);
                              }
                              handleCloseCountryModal();
                            }}
                            activeOpacity={0.7}
                            style={[
                              countryModalStyles.countryItem,
                              isSelected && [styles.countryItemActive, { borderColor: currentTheme.accent }],
                            ]}
                          >
                            <View style={styles.rowCenter}>
                              {countryName === "Todos os países" ? (
                                <Text style={styles.flag18}>🌍</Text>
                              ) : (
                                isSelected && (
                                  <Text style={styles.flag16}>📍</Text>
                                )
                              )}
                              <Text
                                style={[
                                  countryModalStyles.countryName,
                                  isSelected && { color: currentTheme.accent, fontWeight: "bold" },
                                ]}
                              >
                                {countryName}
                              </Text>
                            </View>
                            {isSelected && (
                              <Feather name="check" size={18} color={currentTheme.accent} />
                            )}
                          </TouchableOpacity>
                        );
                      })}
                    </ScrollView>
                  </Animated.View>
                </TouchableWithoutFeedback>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        </View>
      </Modal>

      <ImageBackground source={bgSource} style={styles.backgroundImage} resizeMode="cover">
        <LinearGradient
          colors={["rgba(0, 0, 0, 0.55)", "transparent", "rgba(0, 0, 0, 0.75)"]}
          locations={[0, 0.45, 1]}
          style={styles.flex1}
        >
          {}
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
            <View style={styles.header}>
              <Text style={[styles.headerTitle, { color: "#FFF" }]}>Explorar</Text>
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
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesContainer}>
                {CATEGORIES.map((cat, index) => {
                  const theme = themesByCat[index] || currentTheme;
                  return (
                    <CategoryTabItem
                      key={cat}
                      cat={cat}
                      index={index}
                      isActive={activeCat === index}
                      accentColor={theme.accent}
                      iconName={theme.icon}
                      onPress={() => setActiveCat(index)}
                    />
                  );
                })}
              </ScrollView>
            </View>

            <View style={styles.contentContainer}>
              {loading ? (
                <HomeSkeletonList isDarkMode={isDarkMode} currentTheme={currentTheme} />
              ) : (
                <FadeInView duration={280} style={styles.flex1}>
                  <FlatList
                    data={destinations}
                    keyExtractor={(item) => item.id.toString()}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.cardsList}
                    renderItem={({ item }) => (
                      <HomeCardItem
                        item={item}
                        currentTheme={currentTheme}
                        isDarkMode={isDarkMode}
                        navigation={navigation}
                      />
                    )}
                  />
                </FadeInView>
              )}
            </View>
          </SafeAreaView>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
}
