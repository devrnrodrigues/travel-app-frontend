import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Animated } from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import styles, {
  getFilterAnimatedStyle,
  getFilterButtonActiveBg,
} from "../styles/searchModal.styles";

const HIT_SLOP_10 = { top: 10, bottom: 10, left: 10, right: 10 };

const SearchFilterBar = React.memo(function SearchFilterBar({
  filterAnim,
  selectedCategory,
  selectedCategoryName,
  alphaSort,
  selectedCountry,
  priceSort,
  ratingSort,
  currentTheme,
  isDarkMode = false,
  isMinimalist = false,
  onDismissSearchFocus,
  onOpenCategoryModal,
  onClearCategory,
  onToggleAlphaSort,
  onOpenCountryModal,
  onClearCountry,
  onTogglePriceSort,
  onToggleRatingSort,
}) {
  const animatedHeight = filterAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 50] });
  const animatedMarginBottom = filterAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 15] });
  const animatedOpacity = filterAnim.interpolate({ inputRange: [0, 0.2, 1], outputRange: [0, 0.4, 1] });
  const animatedTranslateY = filterAnim.interpolate({ inputRange: [0, 1], outputRange: [-14, 0] });

  const inactiveBtnStyle = isMinimalist
    ? isDarkMode
      ? styles.filterBtnInactiveMinimalistDark
      : styles.filterBtnInactiveMinimalist
    : styles.filterBtnInactive;
  const inactiveTextStyle = isMinimalist
    ? isDarkMode
      ? styles.filterBtnInactiveTextMinimalistDark
      : styles.filterBtnInactiveTextMinimalist
    : styles.filterBtnInactiveText;
  const inactiveIconColor = isMinimalist
    ? isDarkMode
      ? "#E5E7EB"
      : "#4B5563"
    : "#FFFFFF";

  return (
    <Animated.View
      style={getFilterAnimatedStyle(
        animatedHeight,
        animatedMarginBottom,
        animatedOpacity,
        animatedTranslateY
      )}
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        onScrollBeginDrag={onDismissSearchFocus}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.filterCategoriesContent}
        style={styles.searchFilterRow}
      >
        <TouchableOpacity
          onPress={onOpenCategoryModal}
          activeOpacity={0.75}
          style={[
            styles.filterBtnBase,
            selectedCategory
              ? getFilterButtonActiveBg(currentTheme.accent)
              : inactiveBtnStyle,
          ]}
        >
          <Feather
            name="grid"
            size={14}
            color={selectedCategory ? "#000000" : inactiveIconColor}
            style={styles.marginRight6}
          />
          <Text style={selectedCategory ? styles.filterBtnActiveText : inactiveTextStyle}>
            {selectedCategoryName || "Categorias"}
          </Text>
          {selectedCategory ? (
            <TouchableOpacity
              onPress={onClearCategory}
              hitSlop={HIT_SLOP_10}
              style={styles.marginLeft6}
            >
              <Feather name="x" size={14} color="#000000" />
            </TouchableOpacity>
          ) : null}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onToggleAlphaSort}
          activeOpacity={0.75}
          style={[
            styles.filterBtnBase,
            alphaSort
              ? getFilterButtonActiveBg(currentTheme.accent)
              : inactiveBtnStyle,
          ]}
        >
          <Text style={alphaSort ? styles.filterBtnActiveText : inactiveTextStyle}>
            {alphaSort === "asc" ? "A-Z ↓" : alphaSort === "desc" ? "Z-A ↑" : "A-Z ⇅"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onOpenCountryModal}
          activeOpacity={0.75}
          style={[
            styles.filterBtnBase,
            selectedCountry
              ? getFilterButtonActiveBg(currentTheme.accent)
              : inactiveBtnStyle,
          ]}
        >
          <Feather
            name="globe"
            size={14}
            color={selectedCountry ? "#000000" : inactiveIconColor}
            style={styles.marginRight6}
          />
          <Text style={selectedCountry ? styles.filterBtnActiveText : inactiveTextStyle}>
            {selectedCountry || "Países"}
          </Text>
          {selectedCountry ? (
            <TouchableOpacity
              onPress={onClearCountry}
              hitSlop={HIT_SLOP_10}
              style={styles.marginLeft6}
            >
              <Feather name="x" size={14} color="#000000" />
            </TouchableOpacity>
          ) : null}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onTogglePriceSort}
          activeOpacity={0.75}
          style={[
            styles.filterBtnBase,
            priceSort
              ? getFilterButtonActiveBg(currentTheme.accent)
              : inactiveBtnStyle,
          ]}
        >
          <Text style={priceSort ? styles.filterBtnActiveText : inactiveTextStyle}>
            {priceSort === "asc" ? "Preço ↑" : priceSort === "desc" ? "Preço ↓" : "Preço ↑↓"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onToggleRatingSort}
          activeOpacity={0.75}
          style={[
            styles.filterBtnBase,
            styles.marginRight20,
            ratingSort
              ? getFilterButtonActiveBg(currentTheme.accent)
              : inactiveBtnStyle,
          ]}
        >
          <Ionicons
            name="star"
            size={13}
            color={ratingSort ? "#000000" : inactiveIconColor}
            style={styles.marginRight6}
          />
          <Text style={ratingSort ? styles.filterBtnActiveText : inactiveTextStyle}>
            {ratingSort === "desc" ? "Avaliações ↓" : ratingSort === "asc" ? "Avaliações ↑" : "Avaliações ↑↓"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </Animated.View>
  );
});

export default SearchFilterBar;
