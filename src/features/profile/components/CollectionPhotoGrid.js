import React, { memo, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { PinchGestureHandler } from "react-native-gesture-handler";
import {
  styles,
  getGridItemContainerStyle,
  getGridItemDynamicStyle,
  getHighlightBorderStyle,
  getGridPinchAnimatedStyle,
} from "../styles/collectionGallery.styles";

const CollectionPhotoGrid = memo(function CollectionPhotoGrid({
  photos,
  columns,
  itemDimensions,
  highlightPhotoIndex,
  borderBlinkAnim,
  pinchRef,
  flatListRef,
  isPinching,
  gridOpacity,
  pinchScale,
  onPinchGesture,
  onPinchStateChange,
  onSelectPhoto,
  isDarkMode,
  currentTheme,
}) {
  const { itemWidth, itemHeight, gap, borderRadius } = itemDimensions;

  const renderGridItem = useCallback(
    ({ item, index }) => {
      const isLastInRow = (index + 1) % columns === 0;
      const isHighlighted =
        highlightPhotoIndex !== undefined &&
        highlightPhotoIndex !== null &&
        Number(index) === Number(highlightPhotoIndex);

      const marginRight = isLastInRow ? 0 : gap;
      const accentColor = currentTheme?.accent || "#3B82F6";

      return (
        <View
          style={getGridItemContainerStyle(
            itemWidth,
            itemHeight,
            marginRight,
            gap
          )}
        >
          <TouchableOpacity
            activeOpacity={0.88}
            onPress={() => onSelectPhoto(index)}
            style={[
              styles.gridItem,
              !isDarkMode && styles.gridItemLight,
              getGridItemDynamicStyle(borderRadius),
            ]}
          >
            <Image
              source={{ uri: item.url }}
              style={styles.gridImage}
              resizeMode="cover"
            />
          </TouchableOpacity>

          {isHighlighted && (
            <Animated.View
              pointerEvents="none"
              collapsable={false}
              style={getHighlightBorderStyle(
                borderRadius,
                accentColor,
                borderBlinkAnim
              )}
            />
          )}
        </View>
      );
    },
    [
      columns,
      gap,
      itemWidth,
      itemHeight,
      borderRadius,
      highlightPhotoIndex,
      currentTheme?.accent,
      borderBlinkAnim,
      onSelectPhoto,
      isDarkMode,
    ]
  );

  const renderEmptyComponent = useCallback(() => {
    const iconColor = isDarkMode
      ? "rgba(255, 255, 255, 0.25)"
      : "rgba(0, 0, 0, 0.25)";

    return (
      <View style={styles.emptyListContainer}>
        <Ionicons
          name="images-outline"
          size={52}
          color={iconColor}
          style={styles.emptyListIcon}
        />
        <Text
          style={[
            styles.emptyListTitle,
            !isDarkMode && styles.emptyListTitleLight,
          ]}
        >
          Nenhuma foto na coleção
        </Text>
        <Text
          style={[
            styles.emptyListSubtitle,
            !isDarkMode && styles.emptyListSubtitleLight,
          ]}
        >
          Toque nos três pontos acima para adicionar fotos.
        </Text>
      </View>
    );
  }, [isDarkMode]);

  return (
    <PinchGestureHandler
      ref={pinchRef}
      simultaneousHandlers={flatListRef}
      onGestureEvent={onPinchGesture}
      onHandlerStateChange={onPinchStateChange}
    >
      <Animated.View style={getGridPinchAnimatedStyle(gridOpacity, pinchScale)}>
        <FlatList
          ref={flatListRef}
          scrollEnabled={!isPinching}
          key={`gallery-cols-${columns}`}
          data={photos}
          extraData={highlightPhotoIndex}
          numColumns={columns}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderGridItem}
          contentContainerStyle={styles.gridContent}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          bounces={true}
          ListEmptyComponent={renderEmptyComponent}
        />
      </Animated.View>
    </PinchGestureHandler>
  );
});

export default CollectionPhotoGrid;
