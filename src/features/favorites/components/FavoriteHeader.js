import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import styles from "../styles/favoriteHeader.styles";

export const FavoriteHeader = React.memo(function FavoriteHeader({
  navigation,
  accentColor,
  primaryTextColor,
  isDarkMode,
  isRefetching,
  searchQuery,
  setSearchQuery,
  isFocused,
  setIsFocused,
  searchInputRef,
  handleClearSearch,
  isMinimalist,
}) {
  const iconColor = isFocused
    ? accentColor
    : isDarkMode
    ? "rgba(255, 255, 255, 0.45)"
    : "rgba(0, 0, 0, 0.55)";

  const placeholderColor = isDarkMode
    ? "rgba(255, 255, 255, 0.45)"
    : "rgba(0, 0, 0, 0.50)";

  return (
    <>
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
        {isRefetching ? (
          <ActivityIndicator
            size="small"
            color={accentColor}
            style={styles.refetchIndicator}
          />
        ) : null}
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
            isMinimalist
              ? styles.searchBoxMinimalist
              : isDarkMode
              ? styles.searchBoxDark
              : styles.searchBoxLight,
            isFocused && { borderColor: accentColor },
          ]}
        >
          <Feather
            name="search"
            size={18}
            color={iconColor}
            style={styles.searchIcon}
          />
          <TextInput
            ref={searchInputRef}
            style={[
              styles.searchInput,
              isDarkMode ? styles.searchInputDark : styles.searchInputLight,
            ]}
            placeholder="Buscar"
            placeholderTextColor={placeholderColor}
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
              onPress={handleClearSearch}
              style={styles.searchClearBtn}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons
                name="close-circle"
                size={18}
                color={isDarkMode ? "rgba(255, 255, 255, 0.5)" : "rgba(0, 0, 0, 0.55)"}
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
                size={18}
                color={iconColor}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </>
  );
});

export default FavoriteHeader;
