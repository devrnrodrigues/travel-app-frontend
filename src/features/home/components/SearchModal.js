import React, { useCallback, useMemo } from "react";
import {
  View,
  Dimensions,
  StatusBar,
  Modal,
  Animated,
  Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styles, { getModalSlideStyle } from "../styles/searchModal.styles";
import { SearchSkeletonList, SearchCardSkeleton } from "../../../shared/components/Skeleton";
import FadeInView from "../../../shared/components/FadeInView";
import SearchCardItem from "./SearchCardItem";
import SearchModalHeader from "./SearchModalHeader";
import SearchFilterBar from "./SearchFilterBar";
import SearchModalBackground from "./SearchModalBackground";
import SearchEmptyState from "./SearchEmptyState";
import CountryFilterModal from "./CountryFilterModal";
import CategoryFilterModal from "./CategoryFilterModal";
import useSearchModal from "../hooks/useSearchModal";

export default function SearchModal({
  visible,
  onClose,
  initialCategory = null,
  categories = [],
  currentTheme,
  isDarkMode,
  navigation,
  bgSource,
}) {
  const {
    searchQuery,
    setSearchQuery,
    normalizedSearch,
    selectedCategory,
    setSelectedCategory,
    selectedCategoryName,
    alphaSort,
    setAlphaSort,
    priceSort,
    setPriceSort,
    ratingSort,
    setRatingSort,
    selectedCountry,
    setSelectedCountry,
    isCountryModalVisible,
    setIsCountryModalVisible,
    isCategoryModalVisible,
    setIsCategoryModalVisible,
    isFilterVisible,
    isSearchFocused,
    searchFocusAnim,
    searchInputRef,
    searchSlideAnim,
    searchFadeAnim,
    filterAnim,
    searchScrollY,
    searchFlatListRef,
    isClosingSearch,
    apiDestinations,
    filteredData,
    isSearching,
    isSearchLoading,
    isFetchingNextPage,
    loadNextSearchPage,
    filterIconRotate,
    filterIconScale,
    handleSearchFocus,
    handleSearchBlur,
    dismissSearchFocus,
    toggleFilter,
    handleCloseSearch,
  } = useSearchModal({
    visible,
    onClose,
    initialCategory,
    categories,
  });

  const windowHeight = Dimensions.get("window").height;
  const baseSearchHeight = Math.max(500, windowHeight - 150);
  const searchCardSlot = Math.floor(baseSearchHeight / 6);
  const searchCardHeight = Math.max(72, searchCardSlot - 10);
  const searchCardMarginBottom = Math.max(8, searchCardSlot - searchCardHeight);

  const resolvedBgSource = useMemo(() => {
    if (bgSource) return bgSource;
    if (currentTheme?.bg) {
      return typeof currentTheme.bg === "string" ? { uri: currentTheme.bg } : currentTheme.bg;
    }
    return null;
  }, [bgSource, currentTheme?.bg]);

  const keyExtractor = useCallback((item, index) => (item?.id ? String(item.id) : String(index)), []);

  const handleSelectCard = useCallback(
    (item) => {
      isClosingSearch.current = false;
      Keyboard.dismiss();
      onClose();
      navigation.navigate("Details", { item, currentTheme });
    },
    [isClosingSearch, onClose, navigation, currentTheme]
  );

  const renderCardItem = useCallback(
    ({ item }) => (
      <SearchCardItem
        item={item}
        cardHeight={searchCardHeight}
        cardMarginBottom={searchCardMarginBottom}
        currentTheme={currentTheme}
        isDarkMode={isDarkMode}
        isOverlayActive={isCountryModalVisible || isCategoryModalVisible}
        showPrice={Boolean(priceSort)}
        showRating={Boolean(ratingSort)}
        onPress={() => handleSelectCard(item)}
      />
    ),
    [
      searchCardHeight,
      searchCardMarginBottom,
      currentTheme,
      isDarkMode,
      isCountryModalVisible,
      isCategoryModalVisible,
      priceSort,
      ratingSort,
      handleSelectCard,
    ]
  );

  const renderListFooter = useCallback(() => {
    if (!isFetchingNextPage) return null;
    return (
      <View style={styles.paddingTop6}>
        <SearchCardSkeleton
          cardHeight={searchCardHeight}
          cardMarginBottom={searchCardMarginBottom}
          isDarkMode={isDarkMode}
        />
        <SearchCardSkeleton
          cardHeight={searchCardHeight}
          cardMarginBottom={searchCardMarginBottom}
          isDarkMode={isDarkMode}
        />
      </View>
    );
  }, [isFetchingNextPage, searchCardHeight, searchCardMarginBottom, isDarkMode]);

  const renderListEmpty = useCallback(
    () => <SearchEmptyState normalizedSearch={normalizedSearch} />,
    [normalizedSearch]
  );

  const handleToggleAlphaSort = useCallback(() => {
    dismissSearchFocus();
    setPriceSort(null);
    setRatingSort(null);
    if (alphaSort === null) setAlphaSort("asc");
    else if (alphaSort === "asc") setAlphaSort("desc");
    else setAlphaSort(null);
  }, [dismissSearchFocus, alphaSort, setPriceSort, setRatingSort, setAlphaSort]);

  const handleTogglePriceSort = useCallback(() => {
    dismissSearchFocus();
    setAlphaSort(null);
    setRatingSort(null);
    if (priceSort === null) setPriceSort("asc");
    else if (priceSort === "asc") setPriceSort("desc");
    else setPriceSort(null);
  }, [dismissSearchFocus, priceSort, setAlphaSort, setRatingSort, setPriceSort]);

  const handleToggleRatingSort = useCallback(() => {
    dismissSearchFocus();
    setAlphaSort(null);
    setPriceSort(null);
    if (ratingSort === null) setRatingSort("desc");
    else if (ratingSort === "desc") setRatingSort("asc");
    else setRatingSort(null);
  }, [dismissSearchFocus, ratingSort, setAlphaSort, setPriceSort, setRatingSort]);

  const handleClearCategory = useCallback(
    (e) => {
      e.stopPropagation();
      setSelectedCategory(null);
    },
    [setSelectedCategory]
  );

  const handleClearCountry = useCallback(
    (e) => {
      e.stopPropagation();
      setSelectedCountry(null);
    },
    [setSelectedCountry]
  );

  const handleOpenCategoryModal = useCallback(() => {
    dismissSearchFocus();
    setIsCategoryModalVisible(true);
  }, [dismissSearchFocus, setIsCategoryModalVisible]);

  const handleOpenCountryModal = useCallback(() => {
    dismissSearchFocus();
    setIsCountryModalVisible(true);
  }, [dismissSearchFocus, setIsCountryModalVisible]);

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      animationType="none"
      transparent={true}
      statusBarTranslucent={true}
      navigationBarTranslucent={true}
      onRequestClose={handleCloseSearch}
    >
      <View style={styles.transparentFlex}>
        <SearchModalBackground
          resolvedBgSource={resolvedBgSource}
          searchFadeAnim={searchFadeAnim}
          isDarkMode={isDarkMode}
        />

        <StatusBar barStyle="light-content" translucent={true} backgroundColor="transparent" />

        <Animated.View
          style={[
            styles.flex1,
            getModalSlideStyle(searchFadeAnim, searchSlideAnim),
          ]}
        >
          <SafeAreaView style={styles.searchContainer}>
            <SearchModalHeader
              searchInputRef={searchInputRef}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              isSearching={isSearching}
              isSearchFocused={isSearchFocused}
              isFilterVisible={isFilterVisible}
              isDarkMode={isDarkMode}
              currentTheme={currentTheme}
              searchFocusAnim={searchFocusAnim}
              filterIconRotate={filterIconRotate}
              filterIconScale={filterIconScale}
              onToggleFilter={toggleFilter}
              onCloseSearch={handleCloseSearch}
              onFocus={handleSearchFocus}
              onBlur={handleSearchBlur}
            />

            <SearchFilterBar
              filterAnim={filterAnim}
              selectedCategory={selectedCategory}
              selectedCategoryName={selectedCategoryName}
              alphaSort={alphaSort}
              selectedCountry={selectedCountry}
              priceSort={priceSort}
              ratingSort={ratingSort}
              currentTheme={currentTheme}
              onDismissSearchFocus={dismissSearchFocus}
              onOpenCategoryModal={handleOpenCategoryModal}
              onClearCategory={handleClearCategory}
              onToggleAlphaSort={handleToggleAlphaSort}
              onOpenCountryModal={handleOpenCountryModal}
              onClearCountry={handleClearCountry}
              onTogglePriceSort={handleTogglePriceSort}
              onToggleRatingSort={handleToggleRatingSort}
            />

            {isSearchLoading ? (
              <View style={styles.searchListWrapper}>
                <SearchSkeletonList
                  isDarkMode={isDarkMode}
                  cardHeight={searchCardHeight}
                  cardMarginBottom={searchCardMarginBottom}
                  count={7}
                />
              </View>
            ) : (
              <FadeInView duration={240} style={styles.searchListWrapper}>
                <Animated.FlatList
                  ref={searchFlatListRef}
                  data={filteredData}
                  extraData={[alphaSort, priceSort, ratingSort, selectedCountry, selectedCategory, currentTheme, isDarkMode]}
                  keyExtractor={keyExtractor}
                  showsVerticalScrollIndicator={false}
                  removeClippedSubviews={false}
                  initialNumToRender={12}
                  maxToRenderPerBatch={12}
                  windowSize={10}
                  onScrollBeginDrag={dismissSearchFocus}
                  keyboardDismissMode="on-drag"
                  keyboardShouldPersistTaps="handled"
                  scrollEventThrottle={16}
                  onEndReached={loadNextSearchPage}
                  onEndReachedThreshold={0.5}
                  onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: searchScrollY } } }],
                    { useNativeDriver: true }
                  )}
                  style={styles.flex1}
                  contentContainerStyle={styles.searchListContent}
                  bounces={true}
                  overScrollMode="always"
                  renderItem={renderCardItem}
                  ListFooterComponent={renderListFooter}
                  ListEmptyComponent={renderListEmpty}
                />
              </FadeInView>
            )}
          </SafeAreaView>
        </Animated.View>

        <CountryFilterModal
          visible={isCountryModalVisible}
          onClose={() => setIsCountryModalVisible(false)}
          destinations={apiDestinations}
          selectedCountry={selectedCountry}
          onSelectCountry={setSelectedCountry}
          currentTheme={currentTheme}
          isDarkMode={isDarkMode}
        />

        <CategoryFilterModal
          visible={isCategoryModalVisible}
          onClose={() => setIsCategoryModalVisible(false)}
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          currentTheme={currentTheme}
          isDarkMode={isDarkMode}
        />
      </View>
    </Modal>
  );
}
