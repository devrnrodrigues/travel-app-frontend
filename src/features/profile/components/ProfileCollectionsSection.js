import React, { memo } from "react";
import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { ProfileCollectionsSkeletonList } from "../../../shared/components/Skeleton";
import FadeInView from "../../../shared/components/FadeInView";
import {
  styles,
  getCollectionsSectionDynamicStyle,
  getCollectionsHeaderDynamicStyle,
  getCollectionsHeadingDynamicStyle,
  getCollectionsScrollContentDynamicStyle,
  getAddCardItemDynamicStyle,
  getAddCardCircleDynamicStyle,
  getAddCardTextDynamicStyle,
  getCollectionCardItemDynamicStyle,
  getCollectionCardGradientDynamicStyle,
  getCollectionCardTitleDynamicStyle,
  getCollectionCardSubDynamicStyle,
} from "../styles/profile.styles";

const GRADIENT_START = { x: 0, y: 0 };
const GRADIENT_END = { x: 1, y: 1 };
const CARD_GRADIENT_COLORS = ["transparent", "rgba(0, 0, 0, 0.88)"];
const FALLBACK_COVER =
  "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=600&q=80";

const ProfileCollectionsSection = memo(function ProfileCollectionsSection({
  displayedCollections,
  loading,
  isDarkMode,
  currentTheme,
  scale,
  collectionDimensions,
  onOpenAddCollectionModal,
  onNavigateToCollection,
}) {
  const {
    cardWidth,
    cardHeight,
    cardBorderRadius,
    addCircleSize,
    addIconSize,
    addTextFontSize,
    addTextLineHeight,
    cardTitleFontSize,
    cardSubFontSize,
    cardGradientHeight,
    cardGradientPadding,
    collectionsSectionMarginTop,
    collectionsHeaderMarginBottom,
    collectionsHeadingFontSize,
    collectionsHeadingLineHeight,
  } = collectionDimensions;

  const addCardGradientColors =
    currentTheme?.colors && currentTheme.colors.length >= 2
      ? [currentTheme.colors[0], currentTheme.colors[1]]
      : [currentTheme?.accent || "#4CAF50", "#7C3AED"];

  return (
    <View
      style={getCollectionsSectionDynamicStyle(
        scale,
        collectionsSectionMarginTop
      )}
    >
      <View
        style={getCollectionsHeaderDynamicStyle(
          scale,
          collectionsHeaderMarginBottom
        )}
      >
        <Text
          style={getCollectionsHeadingDynamicStyle(
            isDarkMode,
            scale,
            collectionsHeadingFontSize,
            collectionsHeadingLineHeight
          )}
        >
          Minhas coleções
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={getCollectionsScrollContentDynamicStyle(scale)}
      >
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onOpenAddCollectionModal}
        >
          <LinearGradient
            colors={addCardGradientColors}
            start={GRADIENT_START}
            end={GRADIENT_END}
            style={getAddCardItemDynamicStyle(
              scale,
              cardWidth,
              cardHeight,
              cardBorderRadius
            )}
          >
            <View
              style={getAddCardCircleDynamicStyle(
                scale,
                addCircleSize,
                Math.round(14 * scale)
              )}
            >
              <Ionicons name="add" size={addIconSize} color="#FFFFFF" />
            </View>
            <Text
              style={getAddCardTextDynamicStyle(
                scale,
                addTextFontSize,
                addTextLineHeight
              )}
            >
              Adicionar{"\n"}coleção
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        {loading ? (
          <ProfileCollectionsSkeletonList
            isDarkMode={isDarkMode}
            scale={scale}
            cardWidth={cardWidth}
            cardHeight={cardHeight}
            cardBorderRadius={cardBorderRadius}
            cardGradientHeight={cardGradientHeight}
            cardGradientPadding={cardGradientPadding}
            cardTitleFontSize={cardTitleFontSize}
            cardSubFontSize={cardSubFontSize}
          />
        ) : (
          displayedCollections.map((col, idx) => {
            const coverUri =
              col.photos?.[0]?.url || col.coverUrl || FALLBACK_COVER;

            return (
              <FadeInView
                key={col.id ? `${col.id}_${idx}` : `col_${idx}`}
                duration={350}
              >
                <TouchableOpacity
                  style={getCollectionCardItemDynamicStyle(
                    scale,
                    cardWidth,
                    cardHeight,
                    cardBorderRadius
                  )}
                  activeOpacity={0.85}
                  onPress={() => onNavigateToCollection(col)}
                >
                  <Image
                    source={{ uri: coverUri }}
                    style={styles.collectionCardImage}
                    resizeMode="cover"
                  />
                  <LinearGradient
                    colors={CARD_GRADIENT_COLORS}
                    style={getCollectionCardGradientDynamicStyle(
                      scale,
                      cardGradientHeight,
                      cardGradientPadding
                    )}
                  >
                    <Text
                      numberOfLines={1}
                      style={getCollectionCardTitleDynamicStyle(
                        scale,
                        cardTitleFontSize
                      )}
                    >
                      {col.title}
                    </Text>
                    <Text
                      style={getCollectionCardSubDynamicStyle(
                        scale,
                        cardSubFontSize
                      )}
                    >
                      {col.photos?.length || 0}{" "}
                      {col.photos?.length === 1 ? "foto" : "fotos"}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </FadeInView>
            );
          })
        )}
      </ScrollView>
    </View>
  );
});

export default ProfileCollectionsSection;
