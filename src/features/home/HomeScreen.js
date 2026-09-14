import React, { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { View, Text, ScrollView, TouchableOpacity, FlatList, StatusBar, ImageBackground, Animated, StyleSheet, Easing } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Feather from "react-native-vector-icons/Feather";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import styles from "./home.styles";
import { supabase } from "../../config/supabase";
import { useTheme } from "../../theme/ThemeContext";
import { HomeSkeletonList } from "../../shared/components/Skeleton";
import FadeInView from "../../shared/components/FadeInView";
import HomeCardItem from "./components/HomeCardItem";
import SearchModal from "./components/SearchModal";

const PEXELS_API_KEY = process.env.EXPO_PUBLIC_PEXELS_API_KEY;

const CATEGORIES = [
  "Florestas",
  "Praias",
  "Montanhas",
  "Cachoeiras",
  "Deserto",
  "Neve",
  "Histórico",
  "Urbano",
  "Ilhas",
  "Interior",
];

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

export default function Home({ navigation }) {
  const { activeCat, setActiveCat, currentTheme, themesByCat, isDarkMode } = useTheme();
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const prevCatRef = useRef(activeCat);

  const loadData = async (catIndex = activeCat, showSpinner = false) => {
    if (showSpinner) {
      setLoading(true);
    }
    try {
      const selectedCategory = CATEGORIES[catIndex];
      const { data, error } = await supabase
        .from("destinos")
        .select("*, reviews(rating), price")
        .eq("category", selectedCategory);

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

        if (destination.image_url && destination.image_url.startsWith("http")) {
          return { ...destination, realRating: calculatedRating, isLocalSource: false };
        }
        return { ...destination, realRating: calculatedRating, image_url: selectedTheme.bg, isLocalSource: typeof selectedTheme.bg !== "string" };
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
          colors={["rgba(0, 0, 0, 0.55)", "transparent", "rgba(0, 0, 0, 0.75)"]}
          locations={[0, 0.45, 1]}
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
