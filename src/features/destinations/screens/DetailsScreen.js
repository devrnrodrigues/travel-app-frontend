import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StatusBar,
  Dimensions,
  TextInput,
  Modal,
  TouchableWithoutFeedback,
  FlatList,
  Pressable,
  Animated,
  BackHandler,
  Easing,
  StyleSheet,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import Feather from "react-native-vector-icons/Feather";
import Ionicons from "react-native-vector-icons/Ionicons";
import styles from "../styles/details.styles";
import reviewStyles from "../styles/reviews.styles";
import {
  getWeather,
  getAiDescription,
  getAiPrice,
  getPexelsImages,
  getReviews,
  createReview,
  updateReview,
  deleteReview,
} from "../api/detailsApi";
import { supabase } from "../../../config/supabase";
import { useTheme } from "../../../theme/ThemeContext";
import {
  SkeletonBox,
  DetailsDescriptionSkeleton,
  DetailsReviewsSkeleton,
} from "../../../shared/components/Skeleton";
import FadeInView from "../../../shared/components/FadeInView";

const { width, height } = Dimensions.get("window");
const STRICT_THUMB_SIZE = Math.round(width * 0.115);
const LOOP_BLOCKS = 30;

const ThumbnailItem = React.memo(function ThumbnailItem({ imgUrl, isSelected, accent, onPress, size, isLoading, isDarkMode }) {
  const [loaded, setLoaded] = useState(false);
  const imgAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setLoaded(false);
    imgAnim.setValue(0);
  }, [imgUrl]);

  const handleLoad = () => {
    setLoaded(true);
    Animated.timing(imgAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: Platform.OS !== "web",
    }).start();
  };

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      disabled={isLoading || !imgUrl}
      style={[
        styles.thumbTouch,
        {
          borderColor: isSelected ? accent : "transparent",
          backgroundColor: isDarkMode ? "rgba(18, 18, 18, 0.85)" : "#FFFFFF",
        },
      ]}
    >
      {imgUrl ? (
        <Animated.Image
          source={{ uri: imgUrl }}
          style={[styles.thumbImage, { opacity: imgAnim }]}
          width={size}
          height={size}
          resizeMode="cover"
          onLoad={handleLoad}
        />
      ) : null}
      {(isLoading || !loaded) && (
        <View
          style={[
            styles.thumbLoadingOverlay,
            {
              backgroundColor: isDarkMode ? "rgba(18, 18, 18, 0.85)" : "#FFFFFF",
            },
          ]}
          pointerEvents="none"
        >
          <SkeletonBox width={size} height={size} borderRadius={8} isDarkMode={isDarkMode} />
        </View>
      )}
    </TouchableOpacity>
  );
});

const ReviewDropdownMenu = React.memo(function ReviewDropdownMenu({
  visible,
  isOwner,
  onEdit,
  onDelete,
  onReport,
  isDarkMode,
  onAnimationEnd,
}) {
  const [shouldRender, setShouldRender] = useState(visible);
  const anim = useRef(new Animated.Value(visible ? 1 : 0)).current;

  useEffect(() => {
    if (visible) {
      setShouldRender(true);
      Animated.timing(anim, {
        toValue: 1,
        duration: 180,
        easing: Easing.out(Easing.back(1.4)),
        useNativeDriver: true,
      }).start();
    } else if (shouldRender) {
      Animated.timing(anim, {
        toValue: 0,
        duration: 140,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) {
          setShouldRender(false);
          if (onAnimationEnd) {
            onAnimationEnd();
          }
        }
      });
    }
  }, [visible]);

  if (!shouldRender) return null;

  const opacity = anim;
  const scale = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.85, 1],
  });
  const translateY = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [8, 0],
  });

  return (
    <Animated.View
      style={[
        reviewStyles.anchoredDropdown,
        !isDarkMode && reviewStyles.anchoredDropdownLight,
        {
          opacity,
          transform: [{ scale }, { translateY }],
        },
      ]}
    >
      {isOwner ? (
        <>
          <TouchableOpacity
            style={reviewStyles.anchoredDropdownItem}
            onPress={onEdit}
            activeOpacity={0.7}
          >
            <Feather name="edit-2" size={13} color={!isDarkMode ? "#374151" : "#FFFFFF"} style={styles.marginRight8} />
            <Text style={[reviewStyles.anchoredDropdownText, !isDarkMode && { color: "#374151" }]}>
              Editar
            </Text>
          </TouchableOpacity>

          <View style={[reviewStyles.anchoredDropdownDivider, !isDarkMode && reviewStyles.anchoredDropdownDividerLight]} />

          <TouchableOpacity
            style={reviewStyles.anchoredDropdownItem}
            onPress={onDelete}
            activeOpacity={0.7}
          >
            <Feather name="trash-2" size={13} color="#FF453A" style={styles.marginRight8} />
            <Text style={[reviewStyles.anchoredDropdownText, { color: "#FF453A" }]}>
              Excluir
            </Text>
          </TouchableOpacity>
        </>
      ) : (
        <TouchableOpacity
          style={reviewStyles.anchoredDropdownItem}
          onPress={onReport}
          activeOpacity={0.7}
        >
          <Ionicons name="flag-outline" size={13} color={!isDarkMode ? "#374151" : "#FFFFFF"} style={styles.marginRight8} />
          <Text style={[reviewStyles.anchoredDropdownText, !isDarkMode && { color: "#374151" }]}>
            Reportar
          </Text>
        </TouchableOpacity>
      )}
    </Animated.View>
  );
});

export default function Details({ route, navigation }) {
  const { isDarkMode, toggleThemeMode } = useTheme();
  const { item, currentTheme } = route.params;
  const [description, setDescription] = useState("");
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
  const activeModalIndexRef = useRef(0);
  const modalFlatListRef = useRef(null);

  const validThumbnails = useMemo(() => {
    const list = thumbnails.filter((t) => typeof t === "string" && t.length > 0);
    return list.length > 0 ? list : [item.image_url];
  }, [thumbnails, item.image_url]);

  const infiniteThumbnails = useMemo(() => {
    const list = [];
    for (let i = 0; i < LOOP_BLOCKS; i++) {
      list.push(...validThumbnails);
    }
    return list;
  }, [validThumbnails]);

  const openImageModal = (index) => {
    const targetIndex = typeof index === "number" ? index : validThumbnails.indexOf(mainImage);
    const safeIndex = targetIndex >= 0 ? targetIndex : 0;
    const N = validThumbnails.length;
    
    const middleRound = Math.floor(LOOP_BLOCKS / 2);
    const initialSlide = middleRound * N + safeIndex;
    activeModalIndexRef.current = initialSlide;
    setIsImageModalVisible(true);
  };

  const handleModalScrollEnd = (e) => {
    const offsetX = e.nativeEvent.contentOffset?.x ?? 0;
    const slideW = e.nativeEvent.layoutMeasurement?.width || width;
    if (slideW <= 0) return;

    const currentSlide = Math.round(offsetX / slideW);
    const N = validThumbnails.length;
    if (N === 0) return;

    const realIndex = ((currentSlide % N) + N) % N;
    if (validThumbnails[realIndex]) {
      setMainImage(validThumbnails[realIndex]);
    }
  };

  useEffect(() => {
    if (isImageModalVisible && modalFlatListRef.current) {
      const targetOffset = activeModalIndexRef.current * width;
      modalFlatListRef.current?.scrollToOffset({
        offset: targetOffset,
        animated: false,
      });
      const timer = setTimeout(() => {
        try {
          modalFlatListRef.current?.scrollToOffset({
            offset: targetOffset,
            animated: false,
          });
        } catch (e) { }
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isImageModalVisible]);

  const [isFavorited, setIsFavorited] = useState(!!item.item_id);
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState("N/A");
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [inputComment, setInputComment] = useState("");
  const [isCommentFocused, setIsCommentFocused] = useState(false);
  const commentFocusAnim = useRef(new Animated.Value(0)).current;

  const handleCommentFocus = () => {
    setIsCommentFocused(true);
    Animated.timing(commentFocusAnim, {
      toValue: 1,
      duration: 200,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();
  };

  const handleCommentBlur = () => {
    setIsCommentFocused(false);
    Animated.timing(commentFocusAnim, {
      toValue: 0,
      duration: 200,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();
  };
  const [selectedRating, setSelectedRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [estimatedPrice, setEstimatedPrice] = useState(null);
  const [loadingPrice, setLoadingPrice] = useState(true);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [openedFromAvaliarBtn, setOpenedFromAvaliarBtn] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);
  const [isDeletingReview, setIsDeletingReview] = useState(false);
  const [activeDropdownId, setActiveDropdownId] = useState(null);
  const [elevatedDropdownId, setElevatedDropdownId] = useState(null);
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

  const handleToggleDropdown = useCallback((id) => {
    setActiveDropdownId((prev) => {
      if (prev === id) {
        return null;
      }
      setElevatedDropdownId(id);
      return id;
    });
  }, []);

  const handleDropdownAnimationEnd = useCallback((id) => {
    setElevatedDropdownId((prev) => (prev === id ? null : prev));
  }, []);
  const [helpfulReviews, setHelpfulReviews] = useState({});
  const [reportedReviews, setReportedReviews] = useState({});

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

  const iconRotation = iconRotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
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
      if (showForm) {
        setShowForm(false);
        return true;
      }
      if (activeDropdownId) {
        setActiveDropdownId(null);
        return true;
      }
      if (reviewToDelete) {
        setReviewToDelete(null);
        return true;
      }
      handleGoBack();
      return true;
    };
    const backHandler = BackHandler.addEventListener("hardwareBackPress", onBackPress);
    return () => backHandler.remove();
  }, [isImageModalVisible, showForm, activeDropdownId, reviewToDelete]);

  useFocusEffect(
    useCallback(() => {
      const loadFavoriteStatus = async () => {
        try {
          const { data: { user } } = await supabase.auth.getUser();

          setCurrentUser(user);

          if (!user) return;

          const destinationId = String(item.item_id || item.id);
          const destTitle = (item.title || "").trim().toLowerCase();

          const { data } = await supabase
            .from("favorites")
            .select("id, item_id, title")
            .eq("user_id", user.id);

          const isFav = (data || []).some((f) => {
            const fItemId = f.item_id ? String(f.item_id) : "";
            const fTitle = f.title ? f.title.trim().toLowerCase() : "";
            return (
              (destinationId && fItemId === destinationId) ||
              (item.id && fItemId === String(item.id)) ||
              (destTitle && fTitle === destTitle)
            );
          });

          setIsFavorited(isFav);
        } catch (error) {
          console.error("Erro ao carregar status de favorito:", error);
        }
      };

      loadFavoriteStatus();
    }, [item])
  );

  const fetchReviews = async () => {
    try {
      setLoadingReviews(true);
      const data = await getReviews(item.id);
      setReviews(data);
      if (data.length > 0) {
        const total = data.reduce((sum, review) => sum + Number(review.rating), 0);
        setAverageRating((total / data.length).toFixed(1));
      } else {
        setAverageRating("N/A");
      }
    } catch (err) {
      console.error("Erro ao buscar avaliações:", err);
    } finally {
      setLoadingReviews(false);
    }
  };

  const toggleHelpful = (reviewId) => {
    setHelpfulReviews((prev) => ({
      ...prev,
      [reviewId]: !prev[reviewId],
    }));
  };

  const handleReportReview = (rev) => {
    if (reportedReviews[rev.id]) {
      alert("Você já denunciou este comentário. Nossa equipe está analisando.");
      return;
    }
    setReportedReviews((prev) => ({ ...prev, [rev.id]: true }));
    alert("Comentário reportado com sucesso. Nossa equipe irá analisar.");
  };

  const formatReviewDate = (dateString) => {
    if (!dateString) {
      const d = new Date();
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      const hours = String(d.getHours()).padStart(2, "0");
      const minutes = String(d.getMinutes()).padStart(2, "0");
      return `${year}-${month}-${day} ${hours}:${minutes}`;
    }
    try {
      const d = new Date(dateString);
      if (isNaN(d.getTime())) return "";
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      const hours = String(d.getHours()).padStart(2, "0");
      const minutes = String(d.getMinutes()).padStart(2, "0");
      return `${year}-${month}-${day} ${hours}:${minutes}`;
    } catch (e) {
      return "";
    }
  };

  const userReview = useMemo(() => {
    if (!currentUser || !reviews || reviews.length === 0) return null;
    return reviews.find((rev) => rev.user_id === currentUser.id) || null;
  }, [currentUser, reviews]);

  const handleOpenReviewModal = () => {
    if (!currentUser) {
      alert("Você precisa estar logado para avaliar.");
      return;
    }
    setOpenedFromAvaliarBtn(true);
    if (userReview) {
      setSelectedRating(Number(userReview.rating) || 5);
      setInputComment(userReview.comment || "");
      setEditingReviewId(userReview.id);
    } else {
      setSelectedRating(5);
      setInputComment("");
      setEditingReviewId(null);
    }
    setShowForm(true);
  };

  const handleEditReview = (rev) => {
    setOpenedFromAvaliarBtn(false);
    setSelectedRating(Number(rev.rating) || 5);
    setInputComment(rev.comment || "");
    setEditingReviewId(rev.id);
    setShowForm(true);
  };

  const confirmDeleteReview = async () => {
    if (!reviewToDelete) return;
    try {
      setIsDeletingReview(true);
      await deleteReview(reviewToDelete.id);
      setReviewToDelete(null);
      fetchReviews();
    } catch (err) {
      console.error("Erro ao excluir avaliação:", err);
      alert("Não foi possível excluir o comentário.");
    } finally {
      setIsDeletingReview(false);
    }
  };

  const handleSendReview = async () => {
    try {
      setIsSubmitting(true);
      if (editingReviewId) {
        await updateReview(editingReviewId, {
          rating: selectedRating,
          comment: inputComment.trim() || null,
        });
      } else {
        await createReview({
          destination_id: item.id,
          rating: selectedRating,
          comment: inputComment.trim() || null,
        });
      }
      setInputComment("");
      setSelectedRating(5);
      setEditingReviewId(null);
      setShowForm(false);
      fetchReviews();
    } catch (err) {
      console.error("Erro ao enviar avaliação:", err);
      alert("Não foi possível enviar sua avaliação.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleFavorite = async () => {
    if (!currentUser) {
      alert("Você precisa estar logado.");
      return;
    }

    if (isTogglingFavorite) return;
    setIsTogglingFavorite(true);

    const destinationId = String(item.item_id || item.id);
    const destTitle = (item.title || "").trim().toLowerCase();

    try {
      if (isFavorited) {
        
        setIsFavorited(false);

        const { data: userFavs } = await supabase
          .from("favorites")
          .select("id, item_id, title")
          .eq("user_id", currentUser.id);

        const toDeleteIds = (userFavs || [])
          .filter((f) => {
            const fItemId = f.item_id ? String(f.item_id) : "";
            const fTitle = f.title ? f.title.trim().toLowerCase() : "";
            return (
              (destinationId && fItemId === destinationId) ||
              (item.id && fItemId === String(item.id)) ||
              (destTitle && fTitle === destTitle)
            );
          })
          .map((f) => f.id);

        if (toDeleteIds.length > 0) {
          const { error } = await supabase
            .from("favorites")
            .delete()
            .in("id", toDeleteIds);
          if (error) throw error;
        } else {
          await supabase
            .from("favorites")
            .delete()
            .eq("user_id", currentUser.id)
            .eq("item_id", destinationId);
        }
      } else {
        
        setIsFavorited(true);

        const { data: userFavs } = await supabase
          .from("favorites")
          .select("id, item_id, title")
          .eq("user_id", currentUser.id);

        const alreadyExists = (userFavs || []).some((f) => {
          const fItemId = f.item_id ? String(f.item_id) : "";
          const fTitle = f.title ? f.title.trim().toLowerCase() : "";
          return (
            (destinationId && fItemId === destinationId) ||
            (item.id && fItemId === String(item.id)) ||
            (destTitle && fTitle === destTitle)
          );
        });

        if (alreadyExists) {
          return;
        }

        const { error } = await supabase.from("favorites").insert({
          user_id: currentUser.id,
          item_id: destinationId,
          title: item.title,
          image_url: item.image_url,
          location: item.location,
        });

        if (error) throw error;
      }
    } catch (error) {
      console.error("Erro ao alternar favorito:", error);
      setIsFavorited((prev) => !prev);
    } finally {
      setIsTogglingFavorite(false);
    }
  };

  const fetchWeatherData = async () => {
    try {
      setLoadingWeather(true);
      const weatherData = await getWeather(item.title, item.location);
      setWeather(weatherData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingWeather(false);
    }
  };

  const fetchAiDescription = async () => {
    try {
      setLoadingAi(true);
      const text = await getAiDescription(item);
      setDescription(text);
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

      if (price !== null) {
        await supabase
          .from('destinos')
          .update({ price: price })
          .eq('id', item.id);
      }
    } catch (error) {
      console.error("Erro ao salvar preço:", error);
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
      fetchReviews(),
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
          onPress={() => openImageModal()}
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
          onScrollBeginDrag={() => {
            if (activeDropdownId) setActiveDropdownId(null);
          }}
        >

          {}
          <View style={styles.marginBottom24}>
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

            <Animated.View style={[styles.weatherNoticeWrapper, { maxHeight: weatherInfoAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 20] }), opacity: weatherInfoAnim.interpolate({ inputRange: [0, 0.4, 1], outputRange: [0, 0.5, 1] }), marginTop: weatherInfoAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 4] }) }]}>
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
                  : "Informações de vento e temperatura em tempo real"}
              </Text>
            </Animated.View>
          </View>

          <View style={styles.statsContainer}>
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
              <Text style={[styles.statLabel, !isDarkMode && { color: "#6B7280" }]}>Avaliação</Text>
              {loadingReviews ? (
                <SkeletonBox width={34} height={18} borderRadius={5} isDarkMode={isDarkMode} />
              ) : (
                <FadeInView duration={200}>
                  <Text style={[styles.statValue, { color: currentTheme.accent }]}>
                    {averageRating}
                  </Text>
                </FadeInView>
              )}
            </Animated.View>
          </View>

          {}
          <View style={styles.rowCenterMarginBottom8}>
            <Text style={[styles.descriptionHeader, { marginBottom: 0, flex: 1 }, !isDarkMode && { color: "#111827" }]}>
              Descrição
            </Text>
          </View>

          {loadingAi ? (
            <DetailsDescriptionSkeleton isDarkMode={isDarkMode} />
          ) : (
            <FadeInView duration={240}>
              <Text style={[styles.descriptionBody, !isDarkMode && { color: "#374151" }]}>{description}</Text>
            </FadeInView>
          )}

          {!loadingWeather && weather && (
            <FadeInView duration={240}>
              <Text style={[styles.weatherAlert, !isDarkMode && { color: "#6B7280", fontStyle: "italic" }]}>
                {`Condição climática atual local: ${weather.condition} com ${weather.humidity}% de umidade.`}
              </Text>
            </FadeInView>
          )}

          <View style={reviewStyles.commentSectionContainer}>
            <View style={reviewStyles.commentSectionHeader}>
              <View style={styles.rowCenter}>
                <Ionicons name="chatbubbles-outline" size={18} color={currentTheme.accent} style={styles.marginRight8} />
                <Text style={[reviewStyles.sectionTitle, !isDarkMode && { color: "#111827" }]}>
                  Comentários ({loadingReviews ? "..." : reviews.length})
                </Text>
              </View>

              {!userReview && (
                <TouchableOpacity
                  style={[
                    reviewStyles.inlineActionBtn,
                    {
                      borderColor: currentTheme.accent,
                      borderWidth: 1,
                      borderRadius: 20,
                    },
                    !isDarkMode && {
                      backgroundColor: "#FFFFFF",
                      shadowOpacity: 0,
                      elevation: 0,
                      shadowColor: "transparent",
                      shadowRadius: 0,
                      shadowOffset: { width: 0, height: 0 },
                    },
                  ]}
                  onPress={handleOpenReviewModal}
                  activeOpacity={0.7}
                >
                  <Ionicons name="star" size={12} color={currentTheme.accent} style={styles.marginRight4} />
                  <Text style={[reviewStyles.inlineActionText, { color: currentTheme.accent, fontWeight: "700" }]}>
                    Avaliar
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {loadingReviews ? (
              <DetailsReviewsSkeleton isDarkMode={isDarkMode} count={2} />
            ) : (
              <FadeInView duration={260}>
                {reviews.length === 0 ? (
                  <View
                    style={[
                      reviewStyles.emptyBox,
                      !isDarkMode && {
                        backgroundColor: "#FFFFFF",
                        borderWidth: 0,
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 1 },
                        shadowOpacity: 0.04,
                        shadowRadius: 5,
                        elevation: 1,
                      },
                    ]}
                  >
                    <Ionicons name="chatbox-ellipses-outline" size={32} color={!isDarkMode ? "#9CA3AF" : "rgba(255,255,255,0.3)"} />
                    <Text style={[reviewStyles.emptyText, !isDarkMode && { color: "#6B7280" }]}>Nenhum comentário por aqui ainda. Seja o primeiro a compartilhar sua experiência!</Text>
                  </View>
                ) : (
                  <View style={[reviewStyles.commentsFeed, { position: "relative" }]}>
                    {activeDropdownId !== null && (
                      <Pressable
                        style={[StyleSheet.absoluteFill, { zIndex: 50 }]}
                        onPress={() => setActiveDropdownId(null)}
                      />
                    )}
                    {reviews.map((rev) => {
                      const isMenuElevated = activeDropdownId === rev.id || elevatedDropdownId === rev.id;
                      return (
                        <View
                          key={rev.id}
                          style={[
                            reviewStyles.reviewCard,
                            !isDarkMode && reviewStyles.reviewCardLight,
                            isMenuElevated && { zIndex: 100 },
                          ]}
                        >
                          {}
                          <View
                            style={[
                              reviewStyles.avatarContainer,
                              !isDarkMode && reviewStyles.avatarContainerLight,
                            ]}
                          >
                            {rev.avatar_url || rev.user_avatar ? (
                              <Image
                                source={{ uri: rev.avatar_url || rev.user_avatar }}
                                style={reviewStyles.avatarImage}
                                resizeMode="cover"
                              />
                            ) : (
                              <Text
                                style={[
                                  reviewStyles.avatarInitials,
                                  !isDarkMode && { color: "#4B5563" },
                                ]}
                              >
                                {rev.user_name ? rev.user_name.charAt(0).toUpperCase() : "?"}
                              </Text>
                            )}
                          </View>

                          {}
                          <View style={reviewStyles.reviewContentColumn}>
                            {}
                            <View style={styles.rowWrap}>
                              <Text
                                style={[
                                  reviewStyles.reviewerName,
                                  !isDarkMode && reviewStyles.reviewerNameLight,
                                ]}
                                numberOfLines={1}
                              >
                                {rev.user_name || "Anônimo"}
                              </Text>
                              {currentUser && rev.user_id === currentUser.id && (
                                <Text
                                  style={[
                                    reviewStyles.reviewerName,
                                    {
                                      fontSize: 11.5,
                                      color: !isDarkMode ? "#6B7280" : "#9CA3AF",
                                      fontWeight: "500",
                                      marginLeft: 4,
                                    },
                                  ]}
                                >
                                  (Eu)
                                </Text>
                              )}
                            </View>

                            {}
                            <View style={reviewStyles.starsShopeeRow}>
                              {[1, 2, 3, 4, 5].map((starNum) => (
                                <Ionicons
                                  key={starNum}
                                  name={starNum <= Math.round(Number(rev.rating) || 5) ? "star" : "star-outline"}
                                  size={12}
                                  color={currentTheme.accent}
                                  style={styles.marginRight2}
                                />
                              ))}
                            </View>

                            {}
                            <Text
                              style={[
                                reviewStyles.reviewDate,
                                !isDarkMode && reviewStyles.reviewDateLight,
                              ]}
                            >
                              {formatReviewDate(rev.created_at)}
                            </Text>

                            {}
                            {rev.comment ? (
                              <Text
                                style={[
                                  reviewStyles.reviewComment,
                                  !isDarkMode && reviewStyles.reviewCommentLight,
                                ]}
                              >
                                {rev.comment}
                              </Text>
                            ) : null}

                            {}
                            <View style={reviewStyles.commentFooterRow}>
                              <TouchableOpacity
                                style={reviewStyles.helpfulButton}
                                onPress={() => toggleHelpful(rev.id)}
                                activeOpacity={0.7}
                                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                              >
                                <Ionicons
                                  name={helpfulReviews[rev.id] ? "thumbs-up" : "thumbs-up-outline"}
                                  size={13}
                                  color={
                                    helpfulReviews[rev.id]
                                      ? currentTheme.accent
                                      : !isDarkMode
                                        ? "#9CA3AF"
                                        : "#6B7280"
                                  }
                                />
                                <Text
                                  style={[
                                    reviewStyles.helpfulText,
                                    {
                                      color: helpfulReviews[rev.id]
                                        ? currentTheme.accent
                                        : !isDarkMode
                                          ? "#9CA3AF"
                                          : "#6B7280",
                                    },
                                  ]}
                                >
                                  {helpfulReviews[rev.id] ? "Útil (1)" : "Útil?"}
                                </Text>
                              </TouchableOpacity>

                              <View style={[reviewStyles.menuRelative, { zIndex: isMenuElevated ? 200 : 1 }]}>
                                <TouchableOpacity
                                  style={[
                                    reviewStyles.moreOptionsBtn,
                                    activeDropdownId === rev.id && {
                                      backgroundColor: !isDarkMode ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.08)",
                                      borderRadius: 14,
                                    },
                                  ]}
                                  onPress={() => handleToggleDropdown(rev.id)}
                                  activeOpacity={0.7}
                                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                >
                                  <Ionicons
                                    name="ellipsis-vertical"
                                    size={16}
                                    color={
                                      activeDropdownId === rev.id
                                        ? currentTheme.accent
                                        : !isDarkMode
                                          ? "#9CA3AF"
                                          : "#6B7280"
                                    }
                                  />
                                </TouchableOpacity>

                                <ReviewDropdownMenu
                                  visible={activeDropdownId === rev.id}
                                  isOwner={Boolean(currentUser && rev.user_id === currentUser.id)}
                                  onEdit={() => {
                                    setActiveDropdownId(null);
                                    handleEditReview(rev);
                                  }}
                                  onDelete={() => {
                                    setActiveDropdownId(null);
                                    setReviewToDelete(rev);
                                  }}
                                  onReport={() => {
                                    setActiveDropdownId(null);
                                    handleReportReview(rev);
                                  }}
                                  isDarkMode={isDarkMode}
                                  onAnimationEnd={() => handleDropdownAnimationEnd(rev.id)}
                                />
                              </View>
                            </View>
                          </View>
                        </View>
                      );
                    })}
                  </View>
                )}
              </FadeInView>
            )}
          </View>
        </ScrollView>

        <Modal
          visible={showForm}
          animationType="fade"
          transparent={true}
          statusBarTranslucent={true}
          navigationBarTranslucent={true}
          onRequestClose={() => setShowForm(false)}
        >
          <TouchableWithoutFeedback onPress={() => setShowForm(false)}>
            <View style={reviewStyles.modalOverlay}>
              <TouchableWithoutFeedback>
                <View
                  style={[
                    reviewStyles.formCard,
                    !isDarkMode && {
                      backgroundColor: "rgba(100, 100, 100, 0.82)",
                      borderWidth: 0,
                      shadowColor: "transparent",
                      shadowOpacity: 0,
                      shadowRadius: 0,
                      elevation: 0,
                    },
                  ]}
                >
                  <View style={[reviewStyles.modalHeader, { alignItems: "flex-start" }]}>
                    <View style={reviewStyles.flex1MarginRight10}>
                      <Text style={[reviewStyles.modalTitle, !isDarkMode && { color: "#FFFFFF" }]}>
                        {editingReviewId ? "Editar Avaliação" : "Nova Avaliação"}
                      </Text>
                      {editingReviewId && openedFromAvaliarBtn && (
                        <Text style={!isDarkMode ? reviewStyles.editedInfoTextLight : reviewStyles.editedInfoTextDark}>
                          * Você já avaliou esse destino.
                        </Text>
                      )}
                    </View>
                    <TouchableOpacity onPress={() => setShowForm(false)} style={reviewStyles.marginTop2}>
                      <Ionicons name="close-circle" size={24} color={!isDarkMode ? "#FFFFFF" : "rgba(255,255,255,0.6)"} />
                    </TouchableOpacity>
                  </View>

                  <Text style={[reviewStyles.formLabel, !isDarkMode && { color: "rgba(255, 255, 255, 0.9)" }]}>Sua nota para este local:</Text>
                  <View style={reviewStyles.starsRow}>
                    {[1, 2, 3, 4, 5].map((num) => (
                      <TouchableOpacity key={num} onPress={() => setSelectedRating(num)} style={reviewStyles.marginRight8}>
                        <Ionicons
                          name={num <= selectedRating ? "star" : "star-outline"}
                          size={32}
                          color={currentTheme.accent}
                        />
                      </TouchableOpacity>
                    ))}
                  </View>

                  <Animated.View
                    style={[
                      reviewStyles.input,
                      !isDarkMode && reviewStyles.inputLight,
                      {
                        height: 90,
                        borderWidth: 1.5,
                        borderColor: commentFocusAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: ["transparent", currentTheme.accent],
                        }),
                        paddingHorizontal: 0,
                        paddingVertical: 0,
                      },
                    ]}
                  >
                    <TextInput
                      placeholder="Escreva sua experiência..."
                      placeholderTextColor={!isDarkMode ? "rgba(255, 255, 255, 0.65)" : "#FFFFFF"}
                      value={inputComment}
                      onChangeText={setInputComment}
                      multiline
                      onFocus={handleCommentFocus}
                      onBlur={handleCommentBlur}
                      style={reviewStyles.reviewModalTextInput}
                    />
                  </Animated.View>

                  <TouchableOpacity
                    onPress={handleSendReview}
                    disabled={isSubmitting}
                    style={[reviewStyles.submitBtn, { backgroundColor: currentTheme.accent }]}
                  >
                    {isSubmitting ? (
                      <ActivityIndicator size="small" color="#FFF" />
                    ) : (
                      <Text style={[reviewStyles.submitBtnText, { color: "#FFFFFF" }]}>
                        {editingReviewId ? "Salvar Alterações" : "Publicar"}
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        {}
        <Modal
          visible={!!reviewToDelete}
          transparent={true}
          animationType="fade"
          statusBarTranslucent={true}
          navigationBarTranslucent={true}
          onRequestClose={() => !isDeletingReview && setReviewToDelete(null)}
        >
          <TouchableWithoutFeedback onPress={() => !isDeletingReview && setReviewToDelete(null)}>
            <View style={reviewStyles.dialogOverlay}>
              <TouchableWithoutFeedback>
                <View
                  style={[
                    reviewStyles.dialogCard,
                    !isDarkMode && {
                      backgroundColor: "rgba(100, 100, 100, 0.82)",
                      borderWidth: 0,
                      shadowColor: "transparent",
                      shadowOpacity: 0,
                      shadowRadius: 0,
                      elevation: 0,
                    },
                  ]}
                >
                  <View style={reviewStyles.dialogContentSection}>
                    <Text
                      style={[
                        reviewStyles.dialogTitle,
                        { color: "#FFFFFF" },
                      ]}
                    >
                      Excluir comentário?
                    </Text>
                    <Text
                      style={[
                        reviewStyles.dialogMessage,
                        { color: "rgba(255, 255, 255, 0.85)" },
                      ]}
                    >
                      Deseja realmente remover sua avaliação deste destino?
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={[
                      reviewStyles.dialogActionButton,
                      { borderTopColor: !isDarkMode ? "rgba(0, 0, 0, 0.08)" : "rgba(255, 255, 255, 0.1)" },
                    ]}
                    onPress={confirmDeleteReview}
                    disabled={isDeletingReview}
                    activeOpacity={0.65}
                  >
                    {isDeletingReview ? (
                      <ActivityIndicator size="small" color="#FF3B30" />
                    ) : (
                      <Text style={reviewStyles.dialogDeleteText}>Excluir</Text>
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      reviewStyles.dialogActionButton,
                      reviewStyles.dialogLastButton,
                      { borderTopColor: !isDarkMode ? "rgba(0, 0, 0, 0.08)" : "rgba(255, 255, 255, 0.1)" },
                    ]}
                    onPress={() => setReviewToDelete(null)}
                    disabled={isDeletingReview}
                    activeOpacity={0.65}
                  >
                    <Text
                      style={[
                        reviewStyles.dialogCancelText,
                        { color: "#FFFFFF" },
                      ]}
                    >
                      Cancelar
                    </Text>
                  </TouchableOpacity>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

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

      <Modal
        visible={isImageModalVisible}
        transparent={true}
        animationType="fade"
        statusBarTranslucent={true}
        navigationBarTranslucent={true}
        onRequestClose={() => setIsImageModalVisible(false)}
      >
        <View style={styles.fullImageModalOverlay}>
          {}
          <Pressable
            style={StyleSheet.absoluteFillObject}
            onPress={() => setIsImageModalVisible(false)}
          />

          {}
          <FlatList
            ref={modalFlatListRef}
            data={infiniteThumbnails}
            horizontal
            showsHorizontalScrollIndicator={false}
            bounces={true}
            style={styles.fullScreenCover}
            contentContainerStyle={{ alignItems: "center", justifyContent: "center" }}
            getItemLayout={(_, index) => ({
              length: width,
              offset: width * index,
              index,
            })}
            onLayout={() => {
              modalFlatListRef.current?.scrollToOffset({
                offset: activeModalIndexRef.current * width,
                animated: false,
              });
            }}
            onMomentumScrollEnd={handleModalScrollEnd}
            keyExtractor={(_, index) => `modal-thumb-${index}`}
            windowSize={5}
            maxToRenderPerBatch={5}
            initialNumToRender={5}
            removeClippedSubviews={false}
            renderItem={({ item: imgUri }) => (
              <View style={styles.modalSlide}>
                {}
                <TouchableWithoutFeedback onPress={() => setIsImageModalVisible(false)}>
                  <View style={styles.fullWidthFlex} />
                </TouchableWithoutFeedback>

                {}
                <View style={styles.galleryRow}>
                  <TouchableWithoutFeedback onPress={() => setIsImageModalVisible(false)}>
                    <View style={styles.flex1FullHeight} />
                  </TouchableWithoutFeedback>

                  <View style={styles.modalImageWrapper}>
                    <View style={styles.modalImageInner}>
                      <Image
                        source={{ uri: imgUri }}
                        style={styles.fullImage}
                        resizeMode="cover"
                      />
                    </View>
                  </View>

                  <TouchableWithoutFeedback onPress={() => setIsImageModalVisible(false)}>
                    <View style={styles.flex1FullHeight} />
                  </TouchableWithoutFeedback>
                </View>

                {}
                <TouchableWithoutFeedback onPress={() => setIsImageModalVisible(false)}>
                  <View style={styles.fullWidthFlex} />
                </TouchableWithoutFeedback>
              </View>
            )}
          />
        </View>
      </Modal>
    </Animated.View>
  );
}
