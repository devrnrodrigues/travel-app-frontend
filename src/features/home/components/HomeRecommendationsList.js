import React, { useCallback } from "react";
import { View, Text, FlatList, ActivityIndicator } from "react-native";
import { TopDestinationsSkeletonList } from "../../../shared/components/Skeleton";
import TopDestinationCard from "./TopDestinationCard";
import styles, {
  getTopDestHeaderMargin,
  getTopDestTitleSize,
  getTopFooterLoading,
} from "../styles/home.styles";

const HomeRecommendationsList = React.memo(function HomeRecommendationsList({
  topDestinations,
  currentTheme,
  isDarkMode,
  navigation,
  dims,
  isShowingTopSkeleton,
  isFetchingNextTopPage,
  onEndReached,
}) {
  const keyExtractor = useCallback((item) => (item?.id ? String(item.id) : String(Math.random())), []);

  const renderTopCard = useCallback(
    ({ item }) => (
      <TopDestinationCard
        item={item}
        currentTheme={currentTheme}
        isDarkMode={isDarkMode}
        navigation={navigation}
        cardWidth={dims.topCardWidth}
        cardHeight={dims.topCardHeight}
        imageSize={dims.topCardImageSize}
        titleSize={dims.isSmallScreen ? 14 : dims.isTallScreen ? 17 : 16}
        locationSize={dims.isSmallScreen ? 11.5 : dims.isTallScreen ? 13.5 : 13}
      />
    ),
    [currentTheme, isDarkMode, navigation, dims]
  );

  const renderFooter = useCallback(() => {
    if (!isFetchingNextTopPage) return null;
    return (
      <View style={getTopFooterLoading(dims.topCardHeight)}>
        <ActivityIndicator size="small" color={currentTheme?.accent || "#4CAF50"} />
      </View>
    );
  }, [isFetchingNextTopPage, currentTheme?.accent, dims.topCardHeight]);

  return (
    <View style={styles.topDestinationsSection}>
      <View
        style={[
          styles.topDestinationsHeader,
          getTopDestHeaderMargin(dims.topDestHeaderMarginBottom),
        ]}
      >
        <Text
          style={[
            styles.topDestinationsTitle,
            styles.topDestinationsTitleDark,
            getTopDestTitleSize(dims.topDestTitleSize),
          ]}
        >
          Recomendações
        </Text>
      </View>

      {isShowingTopSkeleton ? (
        <TopDestinationsSkeletonList
          isDarkMode={isDarkMode}
          cardWidth={dims.topCardWidth}
          cardHeight={dims.topCardHeight}
          imageSize={dims.topCardImageSize}
          titleSize={dims.isSmallScreen ? 14 : dims.isTallScreen ? 17 : 16}
          locationSize={dims.isSmallScreen ? 11.5 : dims.isTallScreen ? 13.5 : 13}
        />
      ) : (
        <FlatList
          data={topDestinations}
          keyExtractor={keyExtractor}
          horizontal
          nestedScrollEnabled={true}
          showsHorizontalScrollIndicator={false}
          style={styles.fullWidth}
          contentContainerStyle={styles.topDestinationsList}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.3}
          windowSize={11}
          maxToRenderPerBatch={8}
          initialNumToRender={8}
          removeClippedSubviews={false}
          renderItem={renderTopCard}
          ListFooterComponent={renderFooter}
        />
      )}
    </View>
  );
});

export default HomeRecommendationsList;
