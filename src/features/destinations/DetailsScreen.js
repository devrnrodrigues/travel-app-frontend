import React, { useCallback, useRef } from "react";
import {
  View,
  ScrollView,
  StatusBar,
  Animated,
  RefreshControl,
  Platform,
  UIManager,
} from "react-native";

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}
import { useSafeAreaInsets } from "react-native-safe-area-context";
import styles from "./styles/details.styles";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../theme/ThemeContext";
import useDestinationDetails from "./hooks/useDestinationDetails";
import useDestinationFavorite from "./hooks/useDestinationFavorite";
import useDestinationThemeAnimations from "./hooks/useDestinationThemeAnimations";
import DestinationHeader from "./components/DestinationHeader";
import DestinationDescription from "./components/DestinationDescription";
import DestinationWeather from "./components/DestinationWeather";
import DestinationFooter from "./components/DestinationFooter";
import ReviewsSection from "./components/ReviewsSection";
import ImageGalleryModal from "./components/ImageGalleryModal";
import EstimatedPriceModal from "./components/EstimatedPriceModal";

export default function Details({ route, navigation }) {
  const insets = useSafeAreaInsets();
  const { isDarkMode } = useTheme();
  const { user } = useAuth();
  const { item, currentTheme } = route.params;

  const details = useDestinationDetails(item);
  const favorite = useDestinationFavorite(item, user);
  const themeAnim = useDestinationThemeAnimations(
    isDarkMode,
    navigation,
    details.isImageModalVisible,
    () => details.setIsImageModalVisible(false)
  );
  const reviewsSectionRef = useRef(null);

  const onRefresh = useCallback(async () => {
    details.setRefreshing(true);
    try {
      await Promise.all([
        details.fetchDestinationDetails(true),
        favorite.loadFavoriteStatus(),
        reviewsSectionRef.current?.fetchReviews
          ? reviewsSectionRef.current.fetchReviews(true)
          : Promise.resolve(),
      ]);
    } finally {
      details.setRefreshing(false);
    }
  }, [details, favorite]);

  const handleNavigateTicket = useCallback(() => {
    navigation.navigate("DetailsTicket", {
      currentTheme,
      item: {
        ...item,
        image_url: details.mainImage || item?.image_url || item?.image,
      },
    });
  }, [navigation, currentTheme, item, details.mainImage]);

  return (
    <Animated.View
      style={[
        styles.mainContainer,
        isDarkMode ? styles.containerDark : styles.containerLight,
        {
          opacity: themeAnim.screenFadeAnim,
        },
      ]}
    >
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      <DestinationHeader
        mainImage={details.mainImage}
        onOpenImageModal={() => details.setIsImageModalVisible(true)}
        onGoBack={themeAnim.handleGoBack}
        onToggleFavorite={favorite.toggleFavorite}
        isFavorited={favorite.isFavorited}
        loadingImages={details.loadingImages}
        thumbnails={details.thumbnails}
        onSelectImage={details.setMainImage}
        title={item.title}
        location={item.location}
        currentTheme={currentTheme}
        isDarkMode={isDarkMode}
      />

      <Animated.View
        style={[
          styles.infoBottomSection,
          !isDarkMode
            ? styles.infoBottomSectionLight
            : styles.infoBottomSectionDark,
          {
            backgroundColor: themeAnim.infoSectionBg,
          },
        ]}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          alwaysBounceVertical={true}
          contentContainerStyle={styles.scrollContentDetails}
          refreshControl={
            <RefreshControl
              refreshing={details.refreshing}
              onRefresh={onRefresh}
              tintColor={currentTheme.accent}
              colors={[currentTheme.accent]}
              progressBackgroundColor={isDarkMode ? "#161616" : "#FFFFFF"}
            />
          }
        >
          <DestinationDescription
            description={details.description}
            loadingAi={details.loadingAi}
            isDescriptionExpanded={details.isDescriptionExpanded}
            toggleDescription={details.toggleDescription}
            isDarkMode={isDarkMode}
            currentTheme={currentTheme}
          />

          <DestinationWeather
            weather={details.weather}
            loadingWeather={details.loadingWeather}
            showWeatherInfo={details.showWeatherInfo}
            toggleWeatherInfo={details.toggleWeatherInfo}
            weatherInfoAnim={details.weatherInfoAnim}
            statCardBg={themeAnim.statCardBg}
            currentTheme={currentTheme}
            isDarkMode={isDarkMode}
          />

          <ReviewsSection
            ref={reviewsSectionRef}
            item={item}
            currentUser={user}
            currentTheme={currentTheme}
            isDarkMode={isDarkMode}
          />
        </ScrollView>

        <DestinationFooter
          footerPriceBg={themeAnim.footerPriceBg}
          insetsBottom={insets.bottom}
          isDarkMode={isDarkMode}
          currentTheme={currentTheme}
          loadingPrice={details.loadingPrice}
          costEstimates={details.costEstimates}
          onOpenPriceModal={() => details.setShowPriceModal(true)}
          onNavigateTicket={handleNavigateTicket}
        />
      </Animated.View>

      <ImageGalleryModal
        visible={details.isImageModalVisible}
        onClose={() => details.setIsImageModalVisible(false)}
        thumbnails={details.thumbnails.filter(Boolean)}
        mainImage={details.mainImage}
        onSelectImage={details.setMainImage}
        defaultImage={item.image_url}
      />

      <EstimatedPriceModal
        visible={details.showPriceModal}
        onClose={() => details.setShowPriceModal(false)}
        data={details.costEstimates}
        loading={details.loadingPrice}
        currentTheme={currentTheme}
        isDarkMode={isDarkMode}
      />
    </Animated.View>
  );
}
