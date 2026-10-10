import React from "react";
import { View, TextInput, TouchableOpacity, Animated, ActivityIndicator } from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import styles, {
  getSearchInputAnimatedStyle,
  getFilterIconAnimatedStyle,
} from "../styles/searchModal.styles";

const HIT_SLOP_10 = { top: 10, bottom: 10, left: 10, right: 10 };

const SearchModalHeader = React.memo(function SearchModalHeader({
  searchInputRef,
  searchQuery,
  setSearchQuery,
  isSearching,
  isSearchFocused,
  isFilterVisible,
  isDarkMode,
  isMinimalist = false,
  currentTheme,
  searchFocusAnim,
  filterIconRotate,
  filterIconScale,
  onToggleFilter,
  onCloseSearch,
  onFocus,
  onBlur,
}) {
  const inputBorderColor = searchFocusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["transparent", currentTheme.accent],
  });

  const inputBackgroundColor = searchFocusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: isMinimalist
      ? isDarkMode
        ? ["#1C1C1E", "#1C1C1E"]
        : ["#F3F4F6", "#F3F4F6"]
      : !isDarkMode
      ? ["rgba(100, 100, 100, 0.82)", "rgba(100, 100, 100, 1)"]
      : ["rgba(20, 20, 20, 0.75)", "rgba(10, 10, 10, 0.85)"],
  });

  const placeholderColor = isMinimalist
    ? isDarkMode
      ? "rgba(255, 255, 255, 0.45)"
      : "#9CA3AF"
    : !isDarkMode
    ? "rgba(255, 255, 255, 0.65)"
    : isSearchFocused
      ? "rgba(255, 255, 255, 0.65)"
      : "#FFFFFF";

  return (
    <View style={styles.searchHeaderRow}>
      <TouchableOpacity onPress={onToggleFilter} style={styles.searchBackBtn}>
        <Animated.View style={getFilterIconAnimatedStyle(filterIconRotate, filterIconScale)}>
          <Feather
            name="sliders"
            size={24}
            color={
              isFilterVisible
                ? currentTheme.accent
                : isMinimalist
                ? isDarkMode
                  ? "#FFFFFF"
                  : "#1F2937"
                : "#FFFFFF"
            }
          />
        </Animated.View>
      </TouchableOpacity>
      <Animated.View
        style={[
          styles.searchInputBox,
          getSearchInputAnimatedStyle(inputBorderColor, inputBackgroundColor),
        ]}
      >
        <TextInput
          ref={searchInputRef}
          underlineColorAndroid="transparent"
          style={[
            styles.searchInput,
            isMinimalist && { color: isDarkMode ? "#FFFFFF" : "#1F2937" },
          ]}
          placeholder="Pesquisar destinos..."
          placeholderTextColor={placeholderColor}
          value={searchQuery}
          onChangeText={setSearchQuery}
          onFocus={onFocus}
          onBlur={onBlur}
        />
        {isSearching ? (
          <ActivityIndicator
            size="small"
            color={
              currentTheme?.accent ||
              (isMinimalist ? (isDarkMode ? "#FFFFFF" : "#1F2937") : "#FFFFFF")
            }
            style={styles.marginRight10}
          />
        ) : null}
        {searchQuery.length > 0 && !isSearching ? (
          <TouchableOpacity
            onPress={() => setSearchQuery("")}
            hitSlop={HIT_SLOP_10}
            style={styles.marginRight10}
          >
            <Ionicons
              name="close-circle"
              size={18}
              color={
                isMinimalist
                  ? isDarkMode
                    ? "rgba(255, 255, 255, 0.65)"
                    : "#9CA3AF"
                  : isDarkMode
                  ? "rgba(255, 255, 255, 0.65)"
                  : "#FFFFFF"
              }
            />
          </TouchableOpacity>
        ) : null}
      </Animated.View>
      <TouchableOpacity onPress={onCloseSearch} style={styles.marginLeft15}>
        <Feather
          name="x"
          size={24}
          color={isMinimalist ? (isDarkMode ? "#FFFFFF" : "#1F2937") : "#FFFFFF"}
        />
      </TouchableOpacity>
    </View>
  );
});

export default SearchModalHeader;
