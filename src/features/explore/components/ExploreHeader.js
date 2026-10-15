import React from "react";
import {
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather, Ionicons } from "@expo/vector-icons";
import styles from "../styles/exploreHeader.styles";

const foliageImage = require("../../../../assets/images/image.png");

export const ExploreHeader = React.memo(function ExploreHeader({
  headerPaddingTop,
  isDarkMode,
  searchTranslateY,
  searchOpacity,
  isSearchBarVisible,
  isSearchFocused,
  currentTheme,
  searchQuery,
  setSearchQuery,
  isSearching,
  searchInputRef,
  setIsSearchFocused,
  isMinimalist,
}) {
  const accentColor = currentTheme?.accent || "#4CAF50";
  const placeholderColor = isMinimalist
    ? (isDarkMode ? "#8E8E93" : "#767676")
    : (isDarkMode ? "#8E8E93" : "rgba(255, 255, 255, 0.70)");

  return (
    <Animated.View
      pointerEvents={isSearchBarVisible || isSearchFocused ? "auto" : "none"}
      style={[
        styles.headerBar,
        isMinimalist
          ? isDarkMode
            ? styles.headerBarDark
            : styles.headerBarLight
          : styles.headerBarDecorative,
        {
          paddingTop: headerPaddingTop + (isMinimalist ? 0 : 8),
          transform: [{ translateY: searchTranslateY }],
          opacity: searchOpacity,
        },
      ]}
    >
      {isMinimalist && (
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
                ? ["rgba(0, 0, 0, 0)", "rgba(0, 0, 0, 0.4)", "#000000"]
                : ["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 0.4)", "#FFFFFF"]
            }
            locations={[0, 0.5, 1]}
            style={styles.foliageGradient}
          />
        </View>
      )}
      <View style={styles.searchBarRow}>
        <Pressable
          style={[
            styles.searchBarInputWrapper,
            isMinimalist
              ? isDarkMode
                ? styles.searchBarInputDark
                : styles.searchBarInputLight
              : isDarkMode
              ? styles.searchBarInputDecorativeDark
              : styles.searchBarInputDecorativeLight,
            isSearchFocused && [
              { borderColor: accentColor },
              isMinimalist
                ? isDarkMode
                  ? styles.searchBarInputFocusedDark
                  : styles.searchBarInputFocusedLight
                : isDarkMode
                ? styles.searchBarInputFocusedDecorativeDark
                : styles.searchBarInputFocusedDecorativeLight,
            ],
          ]}
          onPress={() => searchInputRef.current?.focus()}
        >
          <Feather
            name="search"
            size={isMinimalist ? 19 : 21}
            color={
              isSearchFocused
                ? accentColor
                : placeholderColor
            }
            style={styles.searchIcon}
          />
          <TextInput
            ref={searchInputRef}
            style={[
              styles.searchInput,
              isMinimalist
                ? isDarkMode
                  ? styles.searchInputDark
                  : styles.searchInputLight
                : styles.searchInputDark,
            ]}
            placeholder="Pesquisar"
            placeholderTextColor={placeholderColor}
            value={searchQuery}
            maxLength={100}
            onChangeText={setSearchQuery}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            autoCorrect={false}
            selectionColor={accentColor}
          />
          {isSearching ? (
            <ActivityIndicator
              size="small"
              color={accentColor}
              style={styles.searchingIndicator}
            />
          ) : null}
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery("")}
              style={styles.clearButton}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <Ionicons
                name="close-circle"
                size={18}
                color={placeholderColor}
              />
            </TouchableOpacity>
          )}
        </Pressable>

        <TouchableOpacity
          style={[
            styles.photoIconButton,
            isMinimalist
              ? isDarkMode
                ? styles.photoIconButtonDark
                : styles.photoIconButtonLight
              : isDarkMode
              ? styles.photoIconButtonDecorativeDark
              : styles.photoIconButtonDecorativeLight,
          ]}
          activeOpacity={0.7}
          onPress={() => {}}
        >
          <Ionicons
            name="images-outline"
            size={isMinimalist ? 22 : 25}
            color={isMinimalist ? (isDarkMode ? "#FFFFFF" : "#000000") : "#FFFFFF"}
          />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
});

export default ExploreHeader;
