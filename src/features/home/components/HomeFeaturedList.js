import React, { useCallback } from "react";
import { View, FlatList, ActivityIndicator } from "react-native";
import { HomeSkeletonList } from "../../../shared/components/Skeleton";
import FadeInView from "../../../shared/components/FadeInView";
import HomeCardItem from "./HomeCardItem";
import styles from "../styles/home.styles";

const HomeFeaturedList = React.memo(function HomeFeaturedList({
  flatListRef,
  destinations,
  selectedCategory,
  currentTheme,
  isDarkMode,
  navigation,
  dims,
  isShowingSkeleton,
  isFetchingNextPage,
  onEndReached,
}) {
  const keyExtractor = useCallback((item) => (item?.id ? String(item.id) : String(Math.random())), []);

  const renderCardItem = useCallback(
    ({ item }) => (
      <HomeCardItem
        item={item}
        currentTheme={currentTheme}
        isDarkMode={isDarkMode}
        navigation={navigation}
        cardWidth={dims.cardWidth}
        cardHeight={dims.cardHeight}
        cardInfoBottom={dims.cardInfoBottom}
        cardInfoHeight={dims.cardInfoHeight}
      />
    ),
    [currentTheme, isDarkMode, navigation, dims]
  );

  const renderFooter = useCallback(() => {
    if (!isFetchingNextPage) return null;
    return (
      <View style={styles.footerLoadingContainer}>
        <ActivityIndicator size="small" color={currentTheme.accent || "#4CAF50"} />
      </View>
    );
  }, [isFetchingNextPage, currentTheme.accent]);

  if (isShowingSkeleton) {
    return (
      <View style={styles.contentContainer}>
        <HomeSkeletonList
          isDarkMode={isDarkMode}
          currentTheme={currentTheme}
          cardWidth={dims.cardWidth}
          cardHeight={dims.cardHeight}
          cardInfoBottom={dims.cardInfoBottom}
          cardInfoHeight={dims.cardInfoHeight}
        />
      </View>
    );
  }

  return (
    <View style={styles.contentContainer}>
      <FadeInView key={selectedCategory} duration={280} style={styles.fullWidth}>
        <FlatList
          ref={flatListRef}
          data={destinations}
          keyExtractor={keyExtractor}
          horizontal
          nestedScrollEnabled={true}
          showsHorizontalScrollIndicator={false}
          style={styles.fullWidth}
          contentContainerStyle={styles.cardsList}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.3}
          windowSize={11}
          maxToRenderPerBatch={8}
          initialNumToRender={8}
          removeClippedSubviews={false}
          renderItem={renderCardItem}
          ListFooterComponent={renderFooter}
        />
      </FadeInView>
    </View>
  );
});

export default HomeFeaturedList;
