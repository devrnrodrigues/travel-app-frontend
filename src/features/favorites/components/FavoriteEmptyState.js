import React from "react";
import { View, Text } from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import styles from "../styles/favoriteEmptyState.styles";

export const FavoriteEmptyState = React.memo(function FavoriteEmptyState({
  searchQuery,
  isDarkMode,
  primaryTextColor,
  secondaryTextColor,
}) {
  const isSearchActive = searchQuery && searchQuery.trim().length > 0;

  return (
    <View style={styles.emptyContainer}>
      {isSearchActive ? (
        <>
          <View
            style={[
              styles.emptyIconContainer,
              isDarkMode ? styles.emptyIconDark : styles.emptyIconLight,
            ]}
          >
            <Feather
              name="search"
              size={32}
              color={secondaryTextColor}
            />
          </View>
          <Text
            style={[styles.emptyTitle, { color: primaryTextColor }]}
          >
            Nenhum resultado
          </Text>
          <Text
            style={[
              styles.emptySubtitle,
              { color: secondaryTextColor },
            ]}
          >
            Nenhum destino salvo corresponde a "{searchQuery}".
          </Text>
        </>
      ) : (
        <>
          <View
            style={[
              styles.emptyIconContainer,
              isDarkMode ? styles.emptyIconDark : styles.emptyIconLight,
            ]}
          >
            <Ionicons
              name="heart-outline"
              size={34}
              color={secondaryTextColor}
            />
          </View>
          <Text
            style={[styles.emptyTitle, { color: primaryTextColor }]}
          >
            Nenhum favorito ainda
          </Text>
          <Text
            style={[
              styles.emptySubtitle,
              { color: secondaryTextColor },
            ]}
          >
            Toque no coração nos destinos que você mais gostar para
            guardá-los aqui.
          </Text>
        </>
      )}
    </View>
  );
});

export default FavoriteEmptyState;
