import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import styles, {
  getHeaderTopPadding,
  getHeaderTitleSize,
  getIconButtonPadding,
} from "../styles/home.styles";

const HomeHeader = React.memo(function HomeHeader({
  userName,
  dims,
  isDarkMode,
  currentTheme,
  onOpenSearch,
  isMinimalist,
}) {
  return (
    <View style={[styles.header, getHeaderTopPadding(dims.headerPaddingTop)]}>
      <Text
        style={[
          styles.headerTitle,
          isMinimalist
            ? isDarkMode
              ? styles.headerTitleMinimalistDark
              : styles.headerTitleMinimalist
            : styles.headerTitleDark,
          getHeaderTitleSize(dims.headerTitleSize),
        ]}
        numberOfLines={1}
      >
        {`Olá, ${userName}`}
      </Text>
      <View style={styles.headerIcons}>
        <TouchableOpacity
          style={[
            styles.iconButton,
            isMinimalist
              ? isDarkMode
                ? styles.iconButtonMinimalistDark
                : styles.iconButtonMinimalist
              : isDarkMode
              ? styles.iconButtonDark
              : styles.iconButtonLight,
            getIconButtonPadding(dims.iconPadding),
          ]}
          onPress={onOpenSearch}
        >
          <Feather
            name="search"
            size={20}
            color={currentTheme?.accent || "#FFD700"}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
});

export default HomeHeader;
