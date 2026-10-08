import React, { memo } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../styles/collectionGallery.styles";

const HIT_SLOP_8 = { top: 8, bottom: 8, left: 8, right: 8 };

const CollectionGalleryHeader = memo(function CollectionGalleryHeader({
  collectionTitle,
  photoCount,
  isDarkMode,
  onGoBack,
  onOpenMenu,
  menuButtonRef,
}) {
  return (
    <View style={styles.header}>
      <TouchableOpacity
        style={[styles.backButton, !isDarkMode && styles.backButtonLight]}
        onPress={onGoBack}
        activeOpacity={0.7}
        hitSlop={HIT_SLOP_8}
      >
        <Ionicons
          name="chevron-back"
          size={22}
          color={isDarkMode ? "#FFFFFF" : "#000000"}
        />
      </TouchableOpacity>

      <View style={styles.headerInfo}>
        <View style={styles.titleRow}>
          <Text
            style={[
              styles.headerTitle,
              !isDarkMode && styles.headerTitleLight,
            ]}
            numberOfLines={1}
          >
            {collectionTitle}
          </Text>
          <TouchableOpacity
            ref={menuButtonRef}
            style={[
              styles.titleMenuButton,
              !isDarkMode && styles.titleMenuButtonLight,
            ]}
            onPress={onOpenMenu}
            activeOpacity={0.7}
            hitSlop={HIT_SLOP_8}
          >
            <Ionicons
              name="ellipsis-horizontal"
              size={18}
              color={isDarkMode ? "#FFFFFF" : "#000000"}
            />
          </TouchableOpacity>
        </View>
        <Text
          style={[
            styles.headerSubtitle,
            !isDarkMode && styles.headerSubtitleLight,
          ]}
        >
          {photoCount} {photoCount === 1 ? "foto" : "fotos"}
        </Text>
      </View>
    </View>
  );
});

export default CollectionGalleryHeader;
