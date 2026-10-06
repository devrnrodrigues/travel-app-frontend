import { useState, useEffect, useCallback, useRef } from "react";
import { Animated, Easing, LayoutAnimation } from "react-native";
import { getWeather } from "../api/detailsApi";
import { getDestinationById } from "../api/destinationService";
import { parseCostEstimates } from "../utils/destinationUtils";

export function useDestinationDetails(item) {
  const initialImg = item?.image_url || item?.coverImageUrl || null;

  const [description, setDescription] = useState(
    Array.isArray(item?.description)
      ? item.description
      : Array.isArray(item?.aiSummary)
      ? item.aiSummary
      : []
  );
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  const [weather, setWeather] = useState(null);
  const [loadingWeather, setLoadingWeather] = useState(true);
  const [loadingAi, setLoadingAi] = useState(true);
  const [loadingImages, setLoadingImages] = useState(true);

  const [mainImage, setMainImage] = useState(initialImg);
  const [thumbnails, setThumbnails] = useState(
    initialImg ? [initialImg, null, null, null] : [null, null, null, null]
  );
  const [isImageModalVisible, setIsImageModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [costEstimates, setCostEstimates] = useState(() =>
    parseCostEstimates(item?.aiCostEstimates)
  );
  const [loadingPrice, setLoadingPrice] = useState(true);
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [showWeatherInfo, setShowWeatherInfo] = useState(false);
  const weatherInfoAnim = useRef(new Animated.Value(0)).current;

  const toggleDescription = useCallback(() => {
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
  }, []);

  const toggleWeatherInfo = useCallback(() => {
    setShowWeatherInfo((prev) => {
      const next = !prev;
      Animated.timing(weatherInfoAnim, {
        toValue: next ? 1 : 0,
        duration: 320,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }).start();
      return next;
    });
  }, [weatherInfoAnim]);

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
  }, [loadingWeather, weather, weatherInfoAnim]);

  const fetchDestinationDetails = useCallback(async (isPull = false) => {
    const destId = item?.id || item?.item_id;
    if (!destId) return;

    try {
      if (!isPull) {
        setLoadingWeather(true);
        setLoadingAi(true);
        setLoadingImages(true);
        setLoadingPrice(true);
      }
      const data = await getDestinationById(destId);
      if (data) {
        if (data.weather) {
          setWeather({
            temp: Math.round(data.weather.temperature ?? 0),
            humidity: data.weather.rainProbability ?? 0,
            rainProbability: data.weather.rainProbability ?? 0,
            wind: Math.round(data.weather.windSpeed ?? 0),
            condition: data.weather.conditionText || "Tempo estável",
            updatedAt: data.weather.updatedAt,
          });
        } else {
          const fallbackWeather = await getWeather(destId);
          setWeather(fallbackWeather);
        }

        if (
          data.description &&
          (Array.isArray(data.description)
            ? data.description.length > 0
            : Boolean(data.description))
        ) {
          setDescription(data.description);
        } else {
          setDescription(["Descrição indisponivel."]);
        }

        if (data.aiCostEstimates) {
          setCostEstimates(parseCostEstimates(data.aiCostEstimates));
        } else {
          setCostEstimates(null);
        }

        const backendImages =
          Array.isArray(data.images) && data.images.length > 0
            ? data.images.map((img) => img.url).filter(Boolean)
            : [];

        const allImages = [
          data.coverImageUrl || item.image_url,
          ...backendImages.filter(
            (u) => u !== (data.coverImageUrl || item.image_url)
          ),
        ].filter(Boolean);

        if (allImages.length > 0) {
          setMainImage(allImages[0]);
          setThumbnails(allImages.slice(0, 4));
        } else {
          setMainImage(null);
          setThumbnails([]);
        }
      }
    } catch {
      try {
        const fallbackWeather = await getWeather(destId);
        if (fallbackWeather) setWeather(fallbackWeather);
        setDescription(["Descrição indisponivel."]);
      } catch {
        if (!isPull) setDescription(["Descrição indisponivel."]);
      }
      setCostEstimates(null);
    } finally {
      setLoadingWeather(false);
      setLoadingAi(false);
      setLoadingImages(false);
      setLoadingPrice(false);
    }
  }, [item]);

  useEffect(() => {
    setShowWeatherInfo(false);
    weatherInfoAnim.setValue(0);
    const currentImg = item?.image_url || item?.coverImageUrl || null;
    setMainImage(currentImg);
    setLoadingImages(true);
    setLoadingPrice(true);
    setThumbnails(
      currentImg ? [currentImg, null, null, null] : [null, null, null, null]
    );
    fetchDestinationDetails();
  }, [item?.id, fetchDestinationDetails, weatherInfoAnim]);

  return {
    description,
    isDescriptionExpanded,
    toggleDescription,
    weather,
    loadingWeather,
    loadingAi,
    loadingImages,
    mainImage,
    setMainImage,
    thumbnails,
    isImageModalVisible,
    setIsImageModalVisible,
    refreshing,
    setRefreshing,
    costEstimates,
    loadingPrice,
    showPriceModal,
    setShowPriceModal,
    showWeatherInfo,
    weatherInfoAnim,
    toggleWeatherInfo,
    fetchDestinationDetails,
  };
}

export default useDestinationDetails;
