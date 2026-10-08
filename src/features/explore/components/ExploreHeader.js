import React from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
  Animated,
} from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import styles from "../styles/exploreHeader.styles";

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
}) {
  const accentColor = currentTheme?.accent || "#4CAF50";
  const placeholderColor = isDarkMode ? "#8E8E93" : "#767676";

  return (
    <Animated.View
      pointerEvents={isSearchBarVisible || isSearchFocused ? "auto" : "none"}
      style={[
        styles.headerBar,
        isDarkMode ? styles.headerBarDark : styles.headerBarLight,
        {
          paddingTop: headerPaddingTop,
          transform: [{ translateY: searchTranslateY }],
          opacity: searchOpacity,
        },
      ]}
    >
      <View style={styles.searchBarRow}>
        <Pressable
          style={[
            styles.searchBarInputWrapper,
            isDarkMode ? styles.searchBarInputDark : styles.searchBarInputLight,
            isSearchFocused && [
              { borderColor: accentColor },
              isDarkMode
                ? styles.searchBarInputFocusedDark
                : styles.searchBarInputFocusedLight,
            ],
          ]}
          onPress={() => searchInputRef.current?.focus()}
        >
          <Feather
            name="search"
            size={19}
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
              isDarkMode ? styles.searchInputDark : styles.searchInputLight,
            ]}
            placeholder="Pesquisar"
            placeholderTextColor={placeholderColor}
            value={searchQuery}
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
            isDarkMode ? styles.photoIconButtonDark : styles.photoIconButtonLight,
          ]}
          activeOpacity={0.7}
          onPress={() => {}}
        >
          <Ionicons
            name="images-outline"
            size={22}
            color={isDarkMode ? "#FFFFFF" : "#000000"}
          />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
});

export default ExploreHeader;
