import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Dimensions,
  Animated,
  BackHandler,
  Easing,
  StyleSheet,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { useQueryClient } from "@tanstack/react-query";
import Feather from "react-native-vector-icons/Feather";
import Ionicons from "react-native-vector-icons/Ionicons";
import styles from "./styles/details.styles";
import {
  getWeather,
  getAiDescription,
  getAiPrice,
  getPexelsImages,
} from "./api/detailsApi";
import { useAuth } from "../auth/context/AuthContext";
import {
  checkFavoriteApi,
  addFavoriteApi,
  removeFavoriteApi,
} from "../favorites/api/favoriteService";
import { useTheme } from "../../theme/ThemeContext";
import {
  SkeletonBox,
  DetailsDescriptionSkeleton,
} from "../../shared/components/Skeleton";
import FadeInView from "../../shared/components/FadeInView";
import ImageGalleryModal, { ThumbnailItem } from "./components/ImageGalleryModal";
import ReviewsSection from "./components/ReviewsSection";

const { width } = Dimensions.get("window");
const STRICT_THUMB_SIZE = Math.round(width * 0.115);

function formatTimeAgo(dateString) {
  if (!dateString) return "poucos instantes";
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (isNaN(diffInSeconds) || diffInSeconds < 60) {
    return "poucos instantes";
  }
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} ${diffInMinutes === 1 ? "minuto" : "minutos"}`;
  }
  const diffInHours = Math.floor(diffInMinutes / 60);
  const remainingMinutes = diffInMinutes % 60;
  if (diffInHours < 24) {
    const horaStr = `${diffInHours} ${diffInHours === 1 ? "hora" : "horas"}`;
    if (remainingMinutes > 0) {
      return `${horaStr} e ${remainingMinutes} ${remainingMinutes === 1 ? "minuto" : "minutos"}`;
    }
    return horaStr;
  }
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} ${diffInDays === 1 ? "dia" : "dias"}`;
}

function getFirstParagraph(text) {
  if (!text) return "";
  const paragraphs = text.split(/\r?\n\r?\n/).filter((p) => p.trim().length > 0);
  return (paragraphs[0] || text).trim();
}

function getTruncatedFirstParagraph(text) {
  const firstParagraph = getFirstParagraph(text);
  if (!firstParagraph) return "";

  const words = firstParagraph.split(/\s+/);
  if (words.length === 0) return firstParagraph;

  const lastWord = words[words.length - 1];
  const cleanWord = lastWord.replace(/[.,!?;:]+$/, "");
  const halfWord =
    cleanWord.length > 2
      ? cleanWord.slice(0, Math.ceil(cleanWord.length / 2))
      : cleanWord;

  const rest = words.slice(0, -1).join(" ");
  return rest ? `${rest} ${halfWord}...` : `${halfWord}...`;
}

function getRemainingParagraphs(text) {
  if (!text) return "";
  const paragraphs = text.split(/\r?\n\r?\n/).filter((p) => p.trim().length > 0);
  if (paragraphs.length <= 1) return "";
  return paragraphs.slice(1).join("\n\n").trim();
}

export default function Details({ route, navigation }) {
  const queryClient = useQueryClient();
  const { isDarkMode } = useTheme();
  const { user } = useAuth();
  const { item, currentTheme } = route.params;
  const [description, setDescription] = useState("");
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  const toggleDescription = () => {
    LayoutAnimation.configureNext({
      duration: 220,
      create: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      },
      update: {
        type: LayoutAnimation.Types.easeInEaseOut,
      },
      delete: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      },
    });
    setIsDescriptionExpanded((prev) => !prev);
  };
  const [weather, setWeather] = useState(null);
  const [loadingWeather, setLoadingWeather] = useState(true);
  const [loadingAi, setLoadingAi] = useState(true);
  const [loadingPexels, setLoadingPexels] = useState(true);

  const [mainImage, setMainImage] = useState(item.image_url);
  const [thumbnails, setThumbnails] = useState([
    item.image_url,
    null,
    null,
    null,
  ]);
  const [isImageModalVisible, setIsImageModalVisible] = useState(false);

  const [isFavorited, setIsFavorited] = useState(!!item.item_id);
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);
  const [averageRating, setAverageRating] = useState("N/A");
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [estimatedPrice, setEstimatedPrice] = useState(null);
  const [loadingPrice, setLoadingPrice] = useState(true);
  const [showWeatherInfo, setShowWeatherInfo] = useState(false);
  const weatherInfoAnim = useRef(new Animated.Value(0)).current;

  const toggleWeatherInfo = () => {
    const toValue = showWeatherInfo ? 0 : 1;
    setShowWeatherInfo(!showWeatherInfo);
    Animated.timing(weatherInfoAnim, {
      toValue,
      duration: 320,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  };

  useEffect(() => {
    if (!loadingWeather) {
      if (!weather) {
        setShowWeatherInfo(true);
        Animated.timing(weatherInfoAnim, {
          toValue: 1,
          duration: 350,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: false,
        }).start();
      } else {
        setShowWeatherInfo(false);
        Animated.timing(weatherInfoAnim, {
          toValue: 0,
          duration: 250,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: false,
        }).start();
      }
    }
  }, [loadingWeather, weather]);

  const themeAnim = useRef(new Animated.Value(isDarkMode ? 1 : 0)).current;
  const iconRotateAnim = useRef(new Animated.Value(isDarkMode ? 1 : 0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(themeAnim, {
        toValue: isDarkMode ? 1 : 0,
        duration: 380,
        easing: Easing.inOut(Easing.cubic),
        useNativeDriver: false,
      }),
      Animated.timing(iconRotateAnim, {
        toValue: isDarkMode ? 1 : 0,
        duration: 400,
        easing: Easing.out(Easing.back(1.4)),
        useNativeDriver: true,
      }),
    ]).start();
  }, [isDarkMode]);

  const infoSectionBg = themeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#FFFFFF", "#080808ff"],
  });

  const statCardBg = themeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#F8F9FA", "#161616"],
  });

  const footerPriceBg = themeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#FFFFFF", "#0A0A0A"],
  });

  const screenFadeAnim = useRef(new Animated.Value(0)).current;
  const isExitingRef = useRef(false);

  useEffect(() => {
    Animated.timing(screenFadeAnim, {
      toValue: 1,
      duration: 180,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, []);

  const handleGoBack = () => {
    if (isExitingRef.current) return;
    isExitingRef.current = true;
    Animated.timing(screenFadeAnim, {
      toValue: 0,
      duration: 180,
      easing: Easing.in(Easing.ease),
      useNativeDriver: true,
    }).start(() => {
      if (navigation.canGoBack()) {
        navigation.goBack();
      } else {
        navigation.navigate("Main");
      }
    });
  };

  useEffect(() => {
    const onBackPress = () => {
      if (isImageModalVisible) {
        setIsImageModalVisible(false);
        return true;
      }
      handleGoBack();
      return true;
    };
    const backHandler = BackHandler.addEventListener("hardwareBackPress", onBackPress);
    return () => backHandler.remove();
  }, [isImageModalVisible]);

  useFocusEffect(
    useCallback(() => {
      const loadFavoriteStatus = async () => {
        if (!user || !item?.id) return;
        try {
          const isFav = await checkFavoriteApi(item.id);
          setIsFavorited(isFav);
        } catch (error) {
          console.error("Erro ao verificar favorito:", error);
        }
      };

      loadFavoriteStatus();
    }, [item?.id, user])
  );

  const toggleFavorite = async () => {
    if (!user) {
      alert("Você precisa estar logado para favoritar.");
      return;
    }

    if (isTogglingFavorite || !item?.id) return;
    setIsTogglingFavorite(true);

    try {
      if (isFavorited) {
        setIsFavorited(false);
        await removeFavoriteApi(item.id);
      } else {
        setIsFavorited(true);
        await addFavoriteApi(item.id);
      }
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    } catch (error) {
      setIsFavorited((prev) => !prev);
      console.error("Erro ao alternar favorito:", error);
    } finally {
      setIsTogglingFavorite(false);
    }
  };

  const fetchWeatherData = async () => {
    try {
      setLoadingWeather(true);
      const weatherData = await getWeather(item.id || item.item_id);
      setWeather(weatherData);
    } catch {
      setWeather(null);
    } finally {
      setLoadingWeather(false);
    }
  };

  const fetchAiDescription = async () => {
    try {
      setLoadingAi(true);
      const geminiText = await getAiDescription(item);
      const loremParagraphs =
        "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n\nSed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.";
      const fullText = geminiText ? `${geminiText.trim()}\n\n${loremParagraphs}` : loremParagraphs;
      setDescription(fullText);
    } catch (error) {
      console.error(error);
      setDescription("Não foi possível carregar a descrição gerada por IA.");
    } finally {
      setLoadingAi(false);
    }
  };

  const fetchPrice = async () => {
    try {
      setLoadingPrice(true);
      const price = await getAiPrice(item);
      setEstimatedPrice(price);
    } catch (error) {
      console.error("Erro ao obter preço estimado:", error);
    } finally {
      setLoadingPrice(false);
    }
  };

  const fetchPexelsImages = async () => {
    try {
      setLoadingPexels(true);
      const images = await getPexelsImages(item);
      if (images?.length) {
        const filtered = images.filter((img) => img !== item.image_url);
        const combined = [item.image_url, ...filtered].slice(0, 4);
        setThumbnails(combined);
      } else {
        setThumbnails([item.image_url]);
      }
    } catch (error) {
      console.error(error);
      setThumbnails([item.image_url]);
    } finally {
      setLoadingPexels(false);
    }
  };

  useEffect(() => {
    setShowWeatherInfo(false);
    weatherInfoAnim.setValue(0);
    setIsDescriptionExpanded(false);
    setMainImage(item.image_url);
    setLoadingPexels(true);
    setThumbnails([
      item.image_url,
      null,
      null,
      null,
    ]);
    Promise.all([
      fetchWeatherData(),
      fetchAiDescription(),
      fetchPexelsImages(),
      fetchPrice(),
    ]);
  }, [item?.id]);

  return (
    <Animated.View
      style={[
        styles.mainContainer,
        {
          backgroundColor: isDarkMode ? "#000000" : "#FFFFFF",
          opacity: screenFadeAnim,
        },
      ]}
    >
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      <View style={styles.imageSection}>
        <TouchableOpacity
          activeOpacity={0.95}
          onPress={() => setIsImageModalVisible(true)}
          style={styles.mainImageTouchable}
        >
          <Image source={{ uri: mainImage }} style={styles.mainImage} resizeMode="cover" />
        </TouchableOpacity>

        <SafeAreaView style={styles.topBar} pointerEvents="box-none">
          <TouchableOpacity
            style={[
              styles.roundButton,
              !isDarkMode
                ? { backgroundColor: "rgba(255, 255, 255, 0.8)", shadowColor: "#000", shadowOpacity: 0.1 }
                : { backgroundColor: "rgba(0, 0, 0, 0.7)" },
            ]}
            onPress={handleGoBack}
            activeOpacity={0.7}
          >
            <Feather
              name="chevron-left"
              size={24}
              color={!isDarkMode ? "#000000" : "#FFFFFF"}
            />
          </TouchableOpacity>

          <View style={styles.rightActionsColumn} pointerEvents="box-none">
            <TouchableOpacity
              style={[
                styles.roundButton,
                !isDarkMode
                  ? { backgroundColor: "rgba(255, 255, 255, 0.8)", shadowColor: "#000", shadowOpacity: 0.1 }
                  : { backgroundColor: "rgba(0, 0, 0, 0.7)" },
              ]}
              activeOpacity={0.7}
              onPress={toggleFavorite}
            >
              <Ionicons name={isFavorited ? "heart" : "heart-outline"} size={22} color={currentTheme.accent} />
            </TouchableOpacity>

            <View style={styles.rightThumbnails} pointerEvents="box-none">
              {thumbnails.map((imgUrl, index) => (
                <ThumbnailItem
                  key={imgUrl ? `${imgUrl}-${index}` : `loading-thumb-${index}`}
                  imgUrl={imgUrl}
                  isSelected={mainImage === imgUrl}
                  accent={currentTheme.accent}
                  size={STRICT_THUMB_SIZE}
                  isLoading={index > 0 && (!imgUrl || loadingPexels)}
                  isDarkMode={isDarkMode}
                  onPress={() => imgUrl && setMainImage(imgUrl)}
                />
              ))}
            </View>
          </View>
        </SafeAreaView>

        <View style={styles.titleOverlay}>
          <Text style={styles.mainTitle} numberOfLines={2}>{item.title}</Text>
          <View style={styles.locationContainer}>
            <Ionicons name="location-sharp" size={16} color={currentTheme.accent} />
            <Text style={styles.locationText} numberOfLines={1}>{item.location}</Text>
          </View>
        </View>
      </View>

      <Animated.View
        style={[
          styles.infoBottomSection,
          {
            backgroundColor: infoSectionBg,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: -6 },
            shadowOpacity: !isDarkMode ? 0.08 : 0.6,
            shadowRadius: 16,
            elevation: 8,
          },
        ]}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.scrollContent, { paddingTop: 16, paddingBottom: 24 }]}
        >
          <View style={styles.rowCenterMarginBottom8}>
            <Text style={[styles.descriptionHeader, { marginBottom: 0, flex: 1 }, !isDarkMode && { color: "#111827" }]}>
              Descrição
            </Text>
          </View>

          {loadingAi ? (
            <DetailsDescriptionSkeleton isDarkMode={isDarkMode} />
          ) : (
            <FadeInView duration={240}>
              {!isDescriptionExpanded ? (
                <Text style={[styles.descriptionBody, !isDarkMode && { color: "#374151" }]}>
                  {getTruncatedFirstParagraph(description)}{" "}
                  <Text
                    onPress={toggleDescription}
                    style={{ color: currentTheme.accent, fontWeight: "700" }}
                  >
                    ver mais
                  </Text>
                </Text>
              ) : (
                <View>
                  <Text style={[styles.descriptionBody, !isDarkMode && { color: "#374151" }]}>
                    {getFirstParagraph(description)}
                  </Text>
                  {getRemainingParagraphs(description) ? (
                    <Text
                      style={[
                        styles.descriptionBody,
                        { marginTop: 12 },
                        !isDarkMode && { color: "#374151" },
                      ]}
                    >
                      {getRemainingParagraphs(description)}{" "}
                      <Text
                        onPress={toggleDescription}
                        style={{ color: currentTheme.accent, fontWeight: "700" }}
                      >
                        ver menos
                      </Text>
                    </Text>
                  ) : (
                    <Text
                      onPress={toggleDescription}
                      style={{ color: currentTheme.accent, fontWeight: "700" }}
                    >
                      {" "}ver menos
                    </Text>
                  )}
                </View>
              )}
            </FadeInView>
          )}

          <View style={[styles.marginBottom24, { marginTop: 24 }]}>
            <View style={styles.rowSpaceBetween}>
              <View style={styles.rowCenter}>
                <Text style={[styles.descriptionHeader, { marginBottom: 0 }, !isDarkMode && { color: "#111827" }]}>
                  Clima
                </Text>
                <TouchableOpacity
                  onPress={toggleWeatherInfo}
                  activeOpacity={0.65}
                  hitSlop={{ top: 12, bottom: 12, left: 10, right: 10 }}
                  style={styles.weatherCenterMargin}
                >
                  <Feather
                    name="info"
                    size={14}
                    color={showWeatherInfo ? currentTheme.accent : (!isDarkMode ? "#9CA3AF" : "rgba(255, 255, 255, 0.45)")}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <Animated.View style={[styles.weatherNoticeWrapper, { maxHeight: weatherInfoAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 24] }), opacity: weatherInfoAnim.interpolate({ inputRange: [0, 0.4, 1], outputRange: [0, 0.5, 1] }), marginTop: weatherInfoAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 4] }) }]}>
              <Text
                numberOfLines={1}
                style={[
                  styles.weatherNotice,
                  {
                    color: !isDarkMode ? "#6B7280" : "rgba(255, 255, 255, 0.55)",
                    fontSize: 11,
                  },
                ]}
              >
                {!loadingWeather && !weather
                  ? "Sem informações de clima disponíveis"
                  : `Informações de clima atualizado há ${formatTimeAgo(weather?.updatedAt)}`}
              </Text>
            </Animated.View>
          </View>

          <View style={[styles.statsContainer, { marginBottom: (!loadingWeather && weather) ? 0 : 24 }]}>
            <Animated.View
              style={[
                styles.statCard,
                { backgroundColor: statCardBg },
                !isDarkMode ? {
                  borderWidth: 0,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.09,
                  shadowRadius: 8,
                  elevation: 3,
                } : {
                  borderWidth: 0,
                  borderColor: "transparent",
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.6,
                  shadowRadius: 8,
                  elevation: 6,
                },
              ]}
            >
              <Text style={[styles.statLabel, !isDarkMode && { color: "#6B7280" }]}>Vento</Text>
              {loadingWeather ? (
                <SkeletonBox width={46} height={18} borderRadius={5} isDarkMode={isDarkMode} />
              ) : (
                <FadeInView duration={200}>
                  <Text style={[styles.statValue, { color: currentTheme.accent }]}>
                    {weather?.wind != null ? `${weather.wind} km/h` : "N/A"}
                  </Text>
                </FadeInView>
              )}
            </Animated.View>

            <Animated.View
              style={[
                styles.statCard,
                { backgroundColor: statCardBg },
                !isDarkMode ? {
                  borderWidth: 0,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.09,
                  shadowRadius: 8,
                  elevation: 3,
                } : {
                  borderWidth: 0,
                  borderColor: "transparent",
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.6,
                  shadowRadius: 8,
                  elevation: 6,
                },
              ]}
            >
              <Text style={[styles.statLabel, !isDarkMode && { color: "#6B7280" }]}>Temperatura</Text>
              {loadingWeather ? (
                <SkeletonBox width={44} height={18} borderRadius={5} isDarkMode={isDarkMode} />
              ) : (
                <FadeInView duration={200}>
                  <Text style={[styles.statValue, { color: currentTheme.accent }]}>
                    {weather?.temp != null ? `${weather.temp}°C` : "N/A"}
                  </Text>
                </FadeInView>
              )}
            </Animated.View>

            <Animated.View
              style={[
                styles.statCard,
                { backgroundColor: statCardBg },
                !isDarkMode ? {
                  borderWidth: 0,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.09,
                  shadowRadius: 8,
                  elevation: 3,
                } : {
                  borderWidth: 0,
                  borderColor: "transparent",
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.6,
                  shadowRadius: 8,
                  elevation: 6,
                },
              ]}
            >
              <Text style={[styles.statLabel, !isDarkMode && { color: "#6B7280" }]}>Chuva</Text>
              {loadingWeather ? (
                <SkeletonBox width={36} height={18} borderRadius={5} isDarkMode={isDarkMode} />
              ) : (
                <FadeInView duration={200}>
                  <Text style={[styles.statValue, { color: currentTheme.accent }]}>
                    {weather?.rainProbability != null
                      ? `${weather.rainProbability}%`
                      : weather?.humidity != null
                      ? `${weather.humidity}%`
                      : "N/A"}
                  </Text>
                </FadeInView>
              )}
            </Animated.View>
          </View>

          {!loadingWeather && weather && (
            <FadeInView duration={240}>
              <Text
                style={[
                  styles.weatherAlert,
                  {
                    marginTop: 24,
                    marginBottom: 0,
                    color: isDarkMode ? "rgba(255, 255, 255, 0.62)" : "#6B7280",
                    fontStyle: "italic",
                  },
                ]}
              >
                {`Condição climática atual: ${weather.condition}.`}
              </Text>
            </FadeInView>
          )}

          <ReviewsSection
            item={item}
            currentUser={user}
            currentTheme={currentTheme}
            isDarkMode={isDarkMode}
            onRatingCalculated={(calculatedRating, isLoading) => {
              setAverageRating(calculatedRating);
              setLoadingReviews(isLoading);
            }}
          />
        </ScrollView>

        <Animated.View
          style={[
            styles.footerPriceRow,
            {
              backgroundColor: footerPriceBg,
              borderTopWidth: isDarkMode ? StyleSheet.hairlineWidth : 0,
              borderTopColor: isDarkMode ? "rgba(255, 255, 255, 0.12)" : "transparent",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: -4 },
              shadowOpacity: !isDarkMode ? 0.05 : 0.4,
              shadowRadius: 8,
              elevation: 6,
            },
          ]}
        >
          <View style={styles.priceContainer}>
            <Text style={[styles.priceLabel, !isDarkMode && { color: "#6B7280" }]}>Preço Estimado</Text>
            {loadingPrice ? (
              <SkeletonBox width={85} height={20} borderRadius={5} isDarkMode={isDarkMode} />
            ) : (
              <FadeInView duration={200}>
                <Text style={[styles.priceValue, !isDarkMode && { color: "#111827" }]}>
                  {estimatedPrice ? `R$ ${estimatedPrice.toLocaleString("pt-BR")}` : "N/A"}
                </Text>
              </FadeInView>
            )}
          </View>
          <TouchableOpacity
            style={[
              styles.actionButton,
              !isDarkMode
                ? { backgroundColor: "#000000", shadowColor: "#000", shadowOpacity: 0.2, shadowRadius: 6, elevation: 4 }
                : { backgroundColor: currentTheme.accent },
            ]}
            activeOpacity={0.8}
            onPress={() =>
              navigation.navigate("DetailsTicket", {
                currentTheme,
                item: {
                  ...item,
                  image_url: mainImage || item?.image_url || item?.image,
                },
              })
            }
          >
            <Feather name="chevron-right" size={28} color={!isDarkMode ? "#FFFFFF" : "#000"} />
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>

      <ImageGalleryModal
        visible={isImageModalVisible}
        onClose={() => setIsImageModalVisible(false)}
        thumbnails={thumbnails}
        mainImage={mainImage}
        onSelectImage={setMainImage}
        defaultImage={item.image_url}
      />
    </Animated.View>
  );
}
