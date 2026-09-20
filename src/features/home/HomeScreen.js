import React, { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { View, Text, ScrollView, TouchableOpacity, FlatList, StatusBar, ImageBackground, Animated, StyleSheet, Easing, ActivityIndicator, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useInfiniteQuery } from "@tanstack/react-query";
import Feather from "react-native-vector-icons/Feather";
import styles from "./home.styles";
import { useTheme } from "../../theme/ThemeContext";
import { HomeSkeletonList } from "../../shared/components/Skeleton";
import FadeInView from "../../shared/components/FadeInView";
import HomeCardItem from "./components/HomeCardItem";
import SearchModal from "./components/SearchModal";
import { getDestinations } from "../destinations/api/destinationService";

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
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const selectedCategory = CATEGORIES[activeCat] || CATEGORIES[0];
  const selectedTheme = themesByCat[activeCat] || currentTheme;

  const PAGE_SIZE = 6;

  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    hasPreviousPage,
    fetchPreviousPage,
    isFetchingPreviousPage,
  } = useInfiniteQuery({
    queryKey: ["destinations", "home", selectedCategory],
    queryFn: async ({ pageParam = 0 }) => {
      const result = await getDestinations({
        category: selectedCategory,
        page: pageParam,
        size: PAGE_SIZE,
      });
      return (result || []).map((destination) => {
        if (!destination.image_url) {
          return {
            ...destination,
            image_url: selectedTheme.bg,
            isLocalSource: typeof selectedTheme.bg !== "string",
          };
        }
        return {
          ...destination,
          isLocalSource: false,
        };
      });
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      if (!lastPage || lastPage.length < PAGE_SIZE) {
        return undefined;
      }
      return lastPageParam + 1;
    },
    getPreviousPageParam: (firstPage, allPages, firstPageParam) => {
      if (firstPageParam <= 0) {
        return undefined;
      }
      return firstPageParam - 1;
    },
    maxPages: 10,
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

  const loadNextPage = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

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
                    keyExtractor={(item, index) => (item?.id ? `${item.id}-${index}` : String(index))}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.cardsList}
                    onEndReached={loadNextPage}
                    onEndReachedThreshold={0.5}
                    windowSize={5}
                    maxToRenderPerBatch={6}
                    initialNumToRender={6}
                    removeClippedSubviews={Platform.OS === "android"}
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
          </SafeAreaView>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
}
