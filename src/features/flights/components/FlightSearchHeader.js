import React, { memo } from "react";
import { View, Text, TouchableOpacity, ImageBackground } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import styles from "../styles/flightHeader.styles";

function FlightSearchHeaderComponent({
  headerImageSource,
  searchSubmitted,
  destinationTitle,
  isDarkMode,
  onBackPress,
}) {
  return (
    <ImageBackground
      source={headerImageSource}
      style={styles.topHeaderSection}
      resizeMode="cover"
    >
      <LinearGradient
        colors={["rgba(0, 0, 0, 0.22)", "rgba(0, 0, 0, 0.58)"]}
        style={styles.gradientOverlay}
        pointerEvents="none"
      />
      <SafeAreaView style={styles.topBar}>
        <TouchableOpacity
          style={isDarkMode ? styles.roundButtonDark : styles.roundButtonLight}
          onPress={onBackPress}
          activeOpacity={0.7}
        >
          <Feather
            name="chevron-left"
            size={24}
            color={isDarkMode ? "#FFFFFF" : "#000000"}
          />
        </TouchableOpacity>
        <View style={styles.emptyView} />
      </SafeAreaView>
      <Text style={styles.headerTitle} numberOfLines={2}>
        {searchSubmitted ? "Ofertas\nEncontradas" : `Voos para\n${destinationTitle || "o Destino"}`}
      </Text>
    </ImageBackground>
  );
}

export const FlightSearchHeader = memo(FlightSearchHeaderComponent);
