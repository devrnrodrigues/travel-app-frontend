import React, { useState, useCallback, useRef, useEffect, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Modal,
  ScrollView,
  ImageBackground,
  TouchableWithoutFeedback,
  Animated,
  PanResponder,
  Image,
  Easing,
  FlatList,
  Dimensions,
  Platform,
  Keyboard,
  StyleSheet,
} from "react-native";

const { height: WINDOW_HEIGHT } = Dimensions.get("window");
const SCREEN_HEIGHT = Math.max(
  WINDOW_HEIGHT,
  Dimensions.get("screen").height || 0,
  900
);
const MODAL_DISMISS_OFFSET = SCREEN_HEIGHT + 50;
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useQueryClient } from "@tanstack/react-query";
import { useTheme } from "../../theme/ThemeContext";
import { ProfileSkeleton } from "../../shared/components/Skeleton";
import FadeInView from "../../shared/components/FadeInView";
import AnimatedProfileInput from "./components/AnimatedProfileInput";
import { styles, dialogStyles } from "./profile.styles";
import { useAuth } from "../auth/context/AuthContext";
import { ALL_COUNTRIES } from "./data/countries";
import { CountryPillSkeletonGroup } from "./components/CountryPillSkeleton";
import PolaroidStackCard from "./components/PolaroidStackCard";
import { GALLERY_COLLECTIONS } from "./data/mockGallery";
import * as ImagePicker from "expo-image-picker";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";
import { uploadAvatarApi } from "./api/profileService";

export default function ProfileScreen({ navigation }) {
  const { user, logout, updateUser } = useAuth();
  const { currentTheme, isDarkMode, toggleThemeMode } = useTheme();
  const bgSource =
    typeof currentTheme.bg === "string" ? { uri: currentTheme.bg } : currentTheme.bg;

  const [loading, setLoading] = useState(true);
  const [showSkeleton, setShowSkeleton] = useState(loading);
  const transitionAnim = useRef(new Animated.Value(loading ? 0 : 1)).current;

  useEffect(() => {
    if (loading) {
      setShowSkeleton(true);
      transitionAnim.setValue(0);
    } else {
      Animated.timing(transitionAnim, {
        toValue: 1,
        duration: 460,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: Platform.OS !== "web",
      }).start(({ finished }) => {
        if (finished) {
          setShowSkeleton(false);
        }
      });
    }
  }, [loading]);

  const cardOpacity = transitionAnim;
  const galleryOpacity = transitionAnim;

  const skeletonOpacity = transitionAnim.interpolate({
    inputRange: [0, 0.75, 1],
    outputRange: [1, 0.25, 0],
  });

  const [loadingData, setLoadingData] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [avatarModalVisible, setAvatarModalVisible] = useState(false);
  const [addCollectionModalVisible, setAddCollectionModalVisible] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [isCollectionNameFocused, setIsCollectionNameFocused] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const [name, setName] = useState("");
  const [nationality, setNationality] = useState("Brasileiro");
  const [bio, setBio] = useState("");
  const [galleryCount, setGalleryCount] = useState(4);
  const [hideFavorites, setHideFavorites] = useState(false);
  const queryClient = useQueryClient();
  const [focusedInput, setFocusedInput] = useState(null);
  const [hasTypedNationality, setHasTypedNationality] = useState(false);

  const isNationalityFocused = focusedInput === "nationality";
  const countryListAnim = useRef(new Animated.Value(0)).current;
  const blurTimeoutRef = useRef(null);

  const handlePickAndUploadAvatar = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert(
          "Permissão necessária",
          "É necessário permitir o acesso à galeria para alterar a foto de perfil."
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        return;
      }

      const selectedUri = result.assets[0].uri;
      setIsUploadingAvatar(true);

      const manipulated = await manipulateAsync(
        selectedUri,
        [],
        { format: SaveFormat.WEBP }
      );

      const updatedUser = await uploadAvatarApi(manipulated.uri);
      if (updatedUser?.avatarUrl) {
        await updateUser({ avatarUrl: updatedUser.avatarUrl });
      }
    } catch (err) {
      console.error(err);
      const detail =
        (err?.data && typeof err.data === "object" && (err.data.message || err.data.error)) ||
        err?.message ||
        err?.stack ||
        "Não foi possível enviar a imagem.";
      Alert.alert("Erro ao enviar", String(detail));
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const [isSearchingCountry, setIsSearchingCountry] = useState(false);
  const searchTimeoutRef = useRef(null);

  const defaultGalleryHeight = useMemo(() => {
    const screenH = Dimensions.get("window").height;
    return Math.max(340, screenH - 350);
  }, []);

  const [galleryHeight, setGalleryHeight] = useState(defaultGalleryHeight);

  const handleGalleryLayout = useCallback((e) => {
    const h = Math.round(e.nativeEvent.layout.height);
    if (h > 100 && Math.abs(h - galleryHeight) > 6) {
      setGalleryHeight(h);
    }
  }, [galleryHeight]);

  const rowHeight = useMemo(() => {
    return Math.max(160, Math.floor((galleryHeight - 12) / 2));
  }, [galleryHeight]);

  const scrollY = useRef(new Animated.Value(0)).current;

  const getRowAnimProps = useCallback(
    (rowIndex) => {
      const S = rowHeight + 12;
      const enterStart = (rowIndex - 2) * S;
      const enterEnd = (rowIndex - 1) * S;
      const exitStart = rowIndex * S;
      const exitEnd = (rowIndex + 0.85) * S;

      let inputRange = [];
      let opacityRange = [];
      let scaleRange = [];
      let translateYRange = [];

      if (rowIndex === 0) {
        inputRange = [-50, 0, exitStart + S * 0.35, exitEnd];
        opacityRange = [1, 1, 0.65, 0];
        scaleRange = [1, 1, 0.97, 0.92];
        translateYRange = [0, 0, -4, -14];
      } else if (rowIndex === 1) {
        inputRange = [0, exitStart, exitStart + S * 0.35, exitEnd];
        opacityRange = [1, 1, 0.65, 0];
        scaleRange = [1, 1, 0.97, 0.92];
        translateYRange = [0, 0, -4, -14];
      } else if (rowIndex === 2) {
        inputRange = [
          Math.max(0, enterStart),
          enterStart + S * 0.45,
          enterEnd,
          exitStart,
          exitStart + S * 0.35,
          exitEnd,
        ];
        opacityRange = [0, 0.65, 1, 1, 0.65, 0];
        scaleRange = [0.92, 0.96, 1, 1, 0.97, 0.92];
        translateYRange = [14, 6, 0, 0, -4, -14];
      } else {
        inputRange = [
          0,
          Math.max(0, enterStart),
          enterStart + S * 0.45,
          enterEnd,
          exitStart + S,
        ];
        opacityRange = [0, 0, 0.65, 1, 1];
        scaleRange = [0.92, 0.92, 0.96, 1, 1];
        translateYRange = [14, 14, 6, 0, 0];
      }

      const opacity = scrollY.interpolate({
        inputRange,
        outputRange: opacityRange,
        extrapolate: "clamp",
      });

      const scale = scrollY.interpolate({
        inputRange,
        outputRange: scaleRange,
        extrapolate: "clamp",
      });

      const translateY = scrollY.interpolate({
        inputRange,
        outputRange: translateYRange,
        extrapolate: "clamp",
      });

      return { opacity, transform: [{ scale }, { translateY }] };
    },
    [rowHeight, scrollY]
  );

  useEffect(() => {
    AsyncStorage.getItem("@profile_gallery_count").then((val) => {
      if (val !== null && val !== undefined) {
        const parsed = parseInt(val, 10);
        if (parsed >= 0 && parsed <= 8) {
          setGalleryCount(parsed);
        }
      }
    });

    return () => {
      if (blurTimeoutRef.current) {
        clearTimeout(blurTimeoutRef.current);
      }
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    Animated.timing(countryListAnim, {
      toValue: isNationalityFocused ? 1 : 0,
      duration: 250,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();
  }, [isNationalityFocused, countryListAnim]);

  const countryListHeight = countryListAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 48],
  });

  const countryListOpacity = countryListAnim.interpolate({
    inputRange: [0, 0.3, 1],
    outputRange: [0, 0, 1],
  });

  const countryListMargin = countryListAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 16],
  });

  const handleNationalityFocus = () => {
    if (blurTimeoutRef.current) {
      clearTimeout(blurTimeoutRef.current);
    }
    setHasTypedNationality(false);
    setFocusedInput("nationality");
  };

  const handleNationalityBlur = () => {
    blurTimeoutRef.current = setTimeout(() => {
      setFocusedInput((prev) => (prev === "nationality" ? null : prev));
    }, 200);
  };

  const filteredCountries = useMemo(() => {
    if (!hasTypedNationality) {
      return ALL_COUNTRIES;
    }
    const query = (nationality || "")
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    if (!query) {
      return ALL_COUNTRIES;
    }

    return ALL_COUNTRIES.filter((item) => {
      const labelNorm = item.label
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      const countryNorm = item.country
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

      return labelNorm.includes(query) || countryNorm.includes(query);
    });
  }, [nationality, hasTypedNationality]);

  const [countryPage, setCountryPage] = useState(1);
  const COUNTRIES_PAGE_SIZE = 20;

  useEffect(() => {
    setCountryPage(1);
  }, [nationality, hasTypedNationality]);

  const paginatedCountries = useMemo(() => {
    return filteredCountries.slice(0, countryPage * COUNTRIES_PAGE_SIZE);
  }, [filteredCountries, countryPage]);

  const handleLoadMoreCountries = useCallback(() => {
    if (paginatedCountries.length < filteredCountries.length) {
      setCountryPage((prev) => prev + 1);
    }
  }, [paginatedCountries.length, filteredCountries.length]);

  const renderCountryItem = useCallback(
    ({ item }) => {
      const isSelected =
        nationality.trim().toLowerCase() === item.label.toLowerCase() ||
        nationality.trim().toLowerCase() === item.country.toLowerCase();

      return (
        <TouchableOpacity
          key={`${item.code}-${item.label}`}
          style={[
            styles.countryPill,
            !isDarkMode && styles.countryPillLight,
            isSelected && {
              backgroundColor: currentTheme.accent,
            },
          ]}
          onPress={() => {
            if (blurTimeoutRef.current) {
              clearTimeout(blurTimeoutRef.current);
            }
            setNationality(item.label);
            setHasTypedNationality(false);
          }}
          activeOpacity={0.7}
        >
          <View
            style={[
              styles.flagIcon,
              {
                backgroundColor: isDarkMode
                  ? "rgba(255, 255, 255, 0.12)"
                  : "rgba(0, 0, 0, 0.08)",
                overflow: "hidden",
              },
            ]}
          >
            <Image
              source={{ uri: `https://flagcdn.com/w40/${item.code}.png` }}
              style={styles.flagIcon}
              resizeMode="cover"
            />
          </View>
          <Text
            style={[
              styles.countryPillText,
              !isDarkMode && styles.countryPillTextLight,
              isSelected && { color: "#000", fontWeight: "bold" },
            ]}
          >
            {item.label}
          </Text>
        </TouchableOpacity>
      );
    },
    [nationality, isDarkMode, currentTheme.accent]
  );

  const renderListFooter = useCallback(() => {
    if (paginatedCountries.length < filteredCountries.length) {
      return (
        <View style={{ marginLeft: 8 }}>
          <CountryPillSkeletonGroup isDarkMode={isDarkMode} count={2} />
        </View>
      );
    }
    return null;
  }, [paginatedCountries.length, filteredCountries.length, isDarkMode]);

  const renderListEmpty = useCallback(() => {
    return (
      <View style={{ justifyContent: "center", paddingHorizontal: 4 }}>
        <Text
          style={{
            color: !isDarkMode
              ? "rgba(255, 255, 255, 0.7)"
              : "rgba(255, 255, 255, 0.5)",
            fontSize: 13,
          }}
        >
          Nenhum país encontrado
        </Text>
      </View>
    );
  }, [isDarkMode]);

  const modalSlideAnim = useRef(new Animated.Value(MODAL_DISMISS_OFFSET)).current;
  const isClosingModal = useRef(false);
  const iconRotateAnim = useRef(new Animated.Value(isDarkMode ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(iconRotateAnim, {
      toValue: isDarkMode ? 1 : 0,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [isDarkMode]);

  const iconRotation = iconRotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const [isThemeLoading, setIsThemeLoading] = useState(false);

  const handleToggleTheme = async () => {
    if (isThemeLoading) return;
    setIsThemeLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 250));
      await toggleThemeMode();
      await new Promise((resolve) => setTimeout(resolve, 150));
    } catch (e) {
      console.error("Erro ao alternar tema:", e);
    } finally {
      setIsThemeLoading(false);
    }
  };

  useEffect(() => {
    if (modalVisible) {
      isClosingModal.current = false;
      modalSlideAnim.setValue(MODAL_DISMISS_OFFSET);
      Animated.spring(modalSlideAnim, {
        toValue: 0,
        damping: 24,
        stiffness: 220,
        useNativeDriver: true,
      }).start();
    }
  }, [modalVisible, modalSlideAnim]);

  const handleCloseModal = useCallback(() => {
    if (isClosingModal.current) return;
    isClosingModal.current = true;
    Keyboard.dismiss();
    Animated.timing(modalSlideAnim, {
      toValue: MODAL_DISMISS_OFFSET,
      duration: 220,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      setModalVisible(false);
      isClosingModal.current = false;
    });
  }, [modalSlideAnim]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return gestureState.dy > 5;
      },
      onMoveShouldSetPanResponderCapture: (_, gestureState) => {
        return gestureState.dy > 5;
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          modalSlideAnim.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 80 || gestureState.vy > 0.4) {
          handleCloseModal();
        } else {
          Animated.spring(modalSlideAnim, {
            toValue: 0,
            damping: 24,
            stiffness: 220,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;



  const loadProfile = async () => {
    try {
      if (user) {
        setName(user.fullName || "");
        const storedProfileJson = await AsyncStorage.getItem(`profile_${user.id}`);
        if (storedProfileJson) {
          const parsed = JSON.parse(storedProfileJson);
          if (parsed.nationality) {
            let val = parsed.nationality.replace(/[\uD83C-\uDBFF\uDC00-\uDFFF]+/g, "").trim();
            if (val.toLowerCase() === "brasil") val = "Brasileiro";
            setNationality(val);
          } else if (parsed.gender) {
            setNationality("Brasileiro");
          }
          if (parsed.bio) setBio(parsed.bio);
          if (parsed.galleryCount !== undefined && parsed.galleryCount >= 0 && parsed.galleryCount <= 8) {
            setGalleryCount(parsed.galleryCount);
          } else {
            const savedCount = await AsyncStorage.getItem("@profile_gallery_count");
            if (savedCount !== null && savedCount !== undefined) {
              const num = parseInt(savedCount, 10);
              if (num >= 0 && num <= 8) setGalleryCount(num);
            }
          }
        }
      }
    } catch (err) {
      console.error("Erro ao carregar perfil:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleGalleryCountChange = useCallback(async (count) => {
    setGalleryCount(count);
    try {
      await AsyncStorage.setItem("@profile_gallery_count", String(count));
      if (user) {
        const storedProfileJson = await AsyncStorage.getItem(`profile_${user.id}`);
        const parsed = storedProfileJson ? JSON.parse(storedProfileJson) : {};
        parsed.galleryCount = count;
        await AsyncStorage.setItem(`profile_${user.id}`, JSON.stringify(parsed));
      }
    } catch (e) {
      console.error("Erro ao salvar contagem de galerias:", e);
    }
  }, [user]);

  const saveProfile = async () => {
    setLoadingData(true);
    try {
      if (!user) throw new Error("Usuário não autenticado");

      await updateUser({ fullName: name });
      await AsyncStorage.setItem(
        `profile_${user.id}`,
        JSON.stringify({ nationality, bio, galleryCount })
      );
      await AsyncStorage.setItem("@profile_gallery_count", String(galleryCount));

      Alert.alert("Sucesso", "Perfil atualizado com sucesso!");
      handleCloseModal();
    } catch (err) {
      Alert.alert("Erro ao salvar", err.message);
    } finally {
      setLoadingData(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, [])
  );

  const handleOpenLogoutModal = () => {
    setModalVisible(false);
    setLogoutModalVisible(true);
  };

  const handleCancelLogout = () => {
    if (isLoggingOut) return;
    setLogoutModalVisible(false);
  };

  useFocusEffect(
    useCallback(() => {
      AsyncStorage.getItem("@debug_hide_favorites").then((val) => {
        setHideFavorites(val === "true");
      });
    }, [])
  );

  const handleToggleHideFavorites = async () => {
    const nextVal = !hideFavorites;
    setHideFavorites(nextVal);
    await AsyncStorage.setItem("@debug_hide_favorites", String(nextVal));
    queryClient.setQueryData(["hideFavorites"], nextVal);
    queryClient.invalidateQueries({ queryKey: ["favorites"] });
  };

  const confirmLogout = async () => {
    setIsLoggingOut(true);
    try {
      await AsyncStorage.setItem("hasSeenGetStarted", "true");
      await logout();
    } catch (err) {
      console.error("Erro ao desconectar:", err);
    } finally {
      setIsLoggingOut(false);
      setLogoutModalVisible(false);
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={bgSource}
        style={styles.flex1}
        resizeMode="cover"
        blurRadius={4} 
      >
        <LinearGradient
          colors={
            currentTheme?.colors && currentTheme.colors.length >= 3
              ? [
                  currentTheme.colors[0],
                  currentTheme.colors[1],
                  "rgba(0, 0, 0, 0.72)",
                  "rgba(0, 0, 0, 0.96)",
                ]
              : ["rgba(0, 0, 0, 0.45)", "rgba(0, 0, 0, 0.65)", "rgba(0, 0, 0, 0.95)"]
          }
          locations={[0, 0.38, 0.72, 1]}
          style={styles.flex1}
        >
          <SafeAreaView style={styles.flex1}>
            <View style={styles.flex1}>
              <View style={styles.flex1} pointerEvents={loading ? "none" : "auto"}>
                <Animated.View
                  style={[
                    styles.profileCard,
                    !isDarkMode && styles.profileCardLight,
                    { opacity: cardOpacity },
                  ]}
                >
                  <TouchableOpacity
                    style={styles.settingsButton}
                    onPress={() => setModalVisible(true)}
                    activeOpacity={0.6}
                    hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                  >
                    <Ionicons
                      name="settings-sharp"
                      size={22}
                      color={!isDarkMode ? "#FFFFFF" : "#FFF"}
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.avatar,
                      !isDarkMode && styles.avatarLight,
                    ]}
                    activeOpacity={0.8}
                    delayLongPress={300}
                    onLongPress={() => setAvatarModalVisible(true)}
                  >
                    {user?.avatarUrl ? (
                      <Image
                        source={{ uri: user.avatarUrl }}
                        style={styles.avatarImage}
                        resizeMode="cover"
                      />
                    ) : (
                      <Ionicons
                        name="person"
                        size={32}
                        color={currentTheme.accent}
                      />
                    )}
                  </TouchableOpacity>
                  <Text
                    style={[
                      styles.userName,
                      !isDarkMode && styles.userNameLight,
                    ]}
                  >
                    {name || "Usuário"}
                  </Text>
                  <Text
                    style={[
                      styles.userSubtitle,
                      { color: currentTheme.accent },
                    ]}
                  >
                    {nationality || "Viajante"}
                  </Text>
                  <Text
                    style={[
                      styles.bioText,
                      !isDarkMode && styles.bioTextLight,
                    ]}
                  >
                    {bio || "Sem bio definida."}
                  </Text>
                </Animated.View>

                <Animated.View
                  style={[
                    styles.galleryContainer,
                    galleryCount > 4 && styles.galleryContainerScrollable,
                    { opacity: galleryOpacity },
                  ]}
                  onLayout={handleGalleryLayout}
                >
                  {galleryCount === 0 ? (
                    <View
                      style={[
                        styles.emptyGalleryContainer,
                        isDarkMode && styles.emptyGalleryContainerDark,
                      ]}
                    >
                      <Ionicons
                        name="images-outline"
                        size={40}
                        color="rgba(255, 255, 255, 0.92)"
                      />
                      <Text style={styles.emptyGallerySubtitle}>
                        Adicione coleções e salve as fotos das suas viagens.
                      </Text>
                      <TouchableOpacity
                        style={styles.emptyGalleryBtn}
                        onPress={() => setModalVisible(true)}
                        activeOpacity={0.75}
                      >
                        <Ionicons
                          name="add"
                          size={16}
                          color="rgba(255, 255, 255, 0.95)"
                          style={{ marginRight: 4 }}
                        />
                        <Text style={styles.emptyGalleryBtnText}>
                          Adicionar coleção
                        </Text>
                      </TouchableOpacity>
                    </View>
                  ) : galleryCount <= 4 ? (
                    <>
                      <View style={styles.galleryRow}>
                        {galleryCount >= 1 ? (
                          <PolaroidStackCard
                            item={GALLERY_COLLECTIONS[0]}
                            isDarkMode={isDarkMode}
                            currentTheme={currentTheme}
                          />
                        ) : (
                          <View style={styles.gallerySpacer} />
                        )}
                        {galleryCount >= 2 ? (
                          <PolaroidStackCard
                            item={GALLERY_COLLECTIONS[1]}
                            isDarkMode={isDarkMode}
                            currentTheme={currentTheme}
                          />
                        ) : (
                          <View style={styles.gallerySpacer} />
                        )}
                      </View>
                      <View style={styles.galleryRow}>
                        {galleryCount >= 3 ? (
                          <PolaroidStackCard
                            item={GALLERY_COLLECTIONS[2]}
                            isDarkMode={isDarkMode}
                            currentTheme={currentTheme}
                          />
                        ) : (
                          <View style={styles.gallerySpacer} />
                        )}
                        {galleryCount >= 4 ? (
                          <PolaroidStackCard
                            item={GALLERY_COLLECTIONS[3]}
                            isDarkMode={isDarkMode}
                            currentTheme={currentTheme}
                          />
                        ) : (
                          <View style={styles.gallerySpacer} />
                        )}
                      </View>
                    </>
                  ) : (
                    <Animated.ScrollView
                      style={styles.galleryScroll}
                      contentContainerStyle={styles.galleryScrollContent}
                      showsVerticalScrollIndicator={false}
                      bounces={true}
                      nestedScrollEnabled={true}
                      scrollEventThrottle={16}
                      onScroll={Animated.event(
                        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                        { useNativeDriver: Platform.OS !== "web" }
                      )}
                    >
                      {Array.from({ length: Math.ceil(galleryCount / 2) }).map(
                        (_, rowIndex) => {
                          const leftIdx = rowIndex * 2;
                          const rightIdx = rowIndex * 2 + 1;
                          const leftItem =
                            leftIdx < galleryCount
                              ? GALLERY_COLLECTIONS[
                                  leftIdx % GALLERY_COLLECTIONS.length
                                ]
                              : null;
                          const rightItem =
                            rightIdx < galleryCount
                              ? GALLERY_COLLECTIONS[
                                  rightIdx % GALLERY_COLLECTIONS.length
                                ]
                              : null;
                          const animStyle = getRowAnimProps(rowIndex);

                          return (
                            <Animated.View
                              key={rowIndex}
                              style={[
                                styles.galleryRow,
                                {
                                  height: rowHeight,
                                  minHeight: rowHeight,
                                  flexGrow: 0,
                                  flexShrink: 0,
                                  ...(Platform.OS === "web"
                                    ? { flexBasis: rowHeight, width: "100%" }
                                    : { flex: 0 }),
                                },
                                animStyle,
                              ]}
                            >
                              {leftItem ? (
                                <PolaroidStackCard
                                  key={`card_${leftIdx}`}
                                  item={leftItem}
                                  isDarkMode={isDarkMode}
                                  currentTheme={currentTheme}
                                />
                              ) : (
                                <View style={styles.gallerySpacer} />
                              )}

                              {rightItem ? (
                                <PolaroidStackCard
                                  key={`card_${rightIdx}`}
                                  item={rightItem}
                                  isDarkMode={isDarkMode}
                                  currentTheme={currentTheme}
                                />
                              ) : (
                                <View style={styles.gallerySpacer} />
                              )}
                            </Animated.View>
                          );
                        }
                      )}
                    </Animated.ScrollView>
                  )}
                </Animated.View>
              </View>

              {showSkeleton && (
                <Animated.View
                  style={[StyleSheet.absoluteFill, { opacity: skeletonOpacity }]}
                  pointerEvents={loading ? "auto" : "none"}
                >
                  <ProfileSkeleton isDarkMode={isDarkMode} />
                </Animated.View>
              )}
            </View>

            <Modal
              animationType="fade"
              transparent={true}
              visible={modalVisible}
              statusBarTranslucent={true}
              navigationBarTranslucent={true}
              onRequestClose={handleCloseModal}
            >
              <TouchableWithoutFeedback onPress={handleCloseModal}>
                <View style={styles.modalOverlay}>
                  <TouchableWithoutFeedback>
                    <Animated.View
                      style={[
                        styles.modalContent,
                        {
                          transform: [{ translateY: modalSlideAnim }],
                        },
                        !isDarkMode && styles.modalContentLight,
                      ]}
                    >
                      <View
                        {...panResponder.panHandlers}
                        style={styles.dragHandleArea}
                      >
                        <View
                          style={[
                            styles.indicator,
                            !isDarkMode && styles.indicatorLight,
                          ]}
                        />
                        <View style={styles.modalHeader}>
                          <TouchableOpacity
                            onPress={handleCloseModal}
                            style={styles.backButton}
                          >
                            <Ionicons
                              name="chevron-back"
                              size={28}
                              color={!isDarkMode ? "#000000" : "#FFFFFF"}
                            />
                          </TouchableOpacity>
                          <Text
                            style={[
                              styles.modalTitle,
                              !isDarkMode && styles.modalTitleLight,
                            ]}
                          >
                            Editar Perfil
                          </Text>
                          <View style={styles.headerSpacer} />
                        </View>
                      </View>

                      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" style={styles.modalScroll}>
                        <Text
                          style={[
                            styles.label,
                            !isDarkMode && styles.labelLight,
                          ]}
                        >
                          Nome
                        </Text>
                        <AnimatedProfileInput
                          isFocused={focusedInput === "name"}
                          currentTheme={currentTheme}
                          isDarkMode={isDarkMode}
                          placeholder="Seu nome"
                          placeholderTextColor={
                            !isDarkMode
                              ? "rgba(0, 0, 0, 0.40)"
                              : "rgba(255, 255, 255, 0.5)"
                          }
                          value={name}
                          onChangeText={setName}
                          onFocus={() => setFocusedInput("name")}
                          onBlur={() => setFocusedInput(null)}
                        />

                        <Text
                          style={[
                            styles.label,
                            !isDarkMode && styles.labelLight,
                          ]}
                        >
                          Nacionalidade
                        </Text>
                        <AnimatedProfileInput
                          isFocused={isNationalityFocused}
                          currentTheme={currentTheme}
                          isDarkMode={isDarkMode}
                          style={isNationalityFocused ? { marginBottom: 10 } : null}
                          value={nationality}
                          onChangeText={(text) => {
                            setHasTypedNationality(true);
                            setNationality(text);
                            setIsSearchingCountry(true);
                            if (searchTimeoutRef.current) {
                              clearTimeout(searchTimeoutRef.current);
                            }
                            searchTimeoutRef.current = setTimeout(() => {
                              setIsSearchingCountry(false);
                            }, 180);
                          }}
                          onFocus={handleNationalityFocus}
                          onBlur={handleNationalityBlur}
                        />
                        <Animated.View
                          style={{
                            height: countryListHeight,
                            opacity: countryListOpacity,
                            marginBottom: countryListMargin,
                            overflow: "hidden",
                          }}
                        >
                          {isSearchingCountry ? (
                            <View style={styles.countryScrollContent}>
                              <CountryPillSkeletonGroup isDarkMode={isDarkMode} count={4} />
                            </View>
                          ) : (
                            <FlatList
                              horizontal
                              data={paginatedCountries}
                              keyExtractor={(item) => `${item.code}-${item.label}`}
                              renderItem={renderCountryItem}
                              ListEmptyComponent={renderListEmpty}
                              ListFooterComponent={renderListFooter}
                              keyboardShouldPersistTaps="handled"
                              showsHorizontalScrollIndicator={false}
                              contentContainerStyle={styles.countryScrollContent}
                              onEndReached={handleLoadMoreCountries}
                              onEndReachedThreshold={0.4}
                              initialNumToRender={10}
                              maxToRenderPerBatch={10}
                              windowSize={5}
                            />
                          )}
                        </Animated.View>

                        <Text
                          style={[
                            styles.label,
                            !isDarkMode && styles.labelLight,
                          ]}
                        >
                          Bio
                        </Text>
                        <AnimatedProfileInput
                          isFocused={focusedInput === "bio"}
                          currentTheme={currentTheme}
                          isDarkMode={isDarkMode}
                          style={[styles.bioInput, { marginBottom: 8 }]}
                          placeholder="Conte um pouco sobre você..."
                          placeholderTextColor={
                            !isDarkMode
                              ? "rgba(0, 0, 0, 0.40)"
                              : "rgba(255, 255, 255, 0.5)"
                          }
                          multiline={true}
                          numberOfLines={4}
                          value={bio}
                          onChangeText={setBio}
                          onFocus={() => setFocusedInput("bio")}
                          onBlur={() => setFocusedInput(null)}
                        />

                        <TouchableOpacity
                          style={[
                            styles.addCollectionTriggerBtn,
                            !isDarkMode && styles.addCollectionTriggerBtnLight,
                            { marginTop: 4, marginBottom: 8 },
                          ]}
                          activeOpacity={0.75}
                          onPress={() => setAvatarModalVisible(true)}
                        >
                          <View style={styles.addCollectionTriggerLeft}>
                            <View
                              style={[
                                styles.addCollectionTriggerIconBox,
                                !isDarkMode && styles.addCollectionTriggerIconBoxLight,
                              ]}
                            >
                              <Ionicons
                                name="camera"
                                size={17}
                                color={!isDarkMode ? "#000000" : "#FFFFFF"}
                              />
                            </View>
                            <Text
                              style={[
                                styles.addCollectionTriggerText,
                                !isDarkMode && styles.addCollectionTriggerTextLight,
                              ]}
                            >
                              Alterar foto
                            </Text>
                          </View>
                          <Ionicons
                            name="chevron-forward"
                            size={18}
                            color={!isDarkMode ? "rgba(0, 0, 0, 0.4)" : "rgba(255, 255, 255, 0.4)"}
                          />
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={[
                            styles.addCollectionTriggerBtn,
                            !isDarkMode && styles.addCollectionTriggerBtnLight,
                            { marginTop: 0 },
                          ]}
                          activeOpacity={0.75}
                          onPress={() => setAddCollectionModalVisible(true)}
                        >
                          <View style={styles.addCollectionTriggerLeft}>
                            <View
                              style={[
                                styles.addCollectionTriggerIconBox,
                                !isDarkMode && styles.addCollectionTriggerIconBoxLight,
                              ]}
                            >
                              <Ionicons
                                name="images"
                                size={17}
                                color={!isDarkMode ? "#000000" : "#FFFFFF"}
                              />
                            </View>
                            <Text
                              style={[
                                styles.addCollectionTriggerText,
                                !isDarkMode && styles.addCollectionTriggerTextLight,
                              ]}
                            >
                              Adicionar coleção
                            </Text>
                          </View>
                          <Ionicons
                            name="chevron-forward"
                            size={18}
                            color={!isDarkMode ? "rgba(0, 0, 0, 0.4)" : "rgba(255, 255, 255, 0.4)"}
                          />
                        </TouchableOpacity>

                        <Text
                          style={[
                            styles.label,
                            !isDarkMode && styles.labelLight,
                            { marginTop: 14 },
                          ]}
                        >
                          Coleções na galeria
                        </Text>
                        <View style={styles.collectionCountGrid}>
                          <View style={styles.collectionCountRow}>
                            {[0, 1, 2, 3, 4].map((num) => {
                              const isSelected = galleryCount === num;
                              return (
                                <TouchableOpacity
                                  key={num}
                                  style={[
                                    styles.collectionCountBtn,
                                    !isDarkMode && styles.collectionCountBtnLight,
                                    isSelected && {
                                      backgroundColor: currentTheme.accent,
                                    },
                                  ]}
                                  activeOpacity={0.75}
                                  onPress={() => handleGalleryCountChange(num)}
                                >
                                  <Text
                                    style={[
                                      styles.collectionCountText,
                                      !isDarkMode && styles.collectionCountTextLight,
                                      isSelected && styles.collectionCountTextActive,
                                    ]}
                                  >
                                    {num}
                                  </Text>
                                </TouchableOpacity>
                              );
                            })}
                          </View>
                          <View style={styles.collectionCountRow}>
                            {[5, 6, 7, 8].map((num) => {
                              const isSelected = galleryCount === num;
                              return (
                                <TouchableOpacity
                                  key={num}
                                  style={[
                                    styles.collectionCountBtn,
                                    !isDarkMode && styles.collectionCountBtnLight,
                                    isSelected && {
                                      backgroundColor: currentTheme.accent,
                                    },
                                  ]}
                                  activeOpacity={0.75}
                                  onPress={() => handleGalleryCountChange(num)}
                                >
                                  <Text
                                    style={[
                                      styles.collectionCountText,
                                      !isDarkMode && styles.collectionCountTextLight,
                                      isSelected && styles.collectionCountTextActive,
                                    ]}
                                  >
                                    {num}
                                  </Text>
                                </TouchableOpacity>
                              );
                            })}
                            <View style={{ flex: 1 }} />
                          </View>
                        </View>

                        <View style={styles.hideFavoritesSection}>
                          <Text
                            style={[
                              styles.label,
                              !isDarkMode && styles.labelLight,
                            ]}
                          >
                            Visualização dos Favoritos
                          </Text>
                          <TouchableOpacity
                            style={[
                              styles.hideFavoritesBtn,
                              !isDarkMode && styles.hideFavoritesBtnLight,
                              hideFavorites && {
                                borderColor: currentTheme.accent,
                                backgroundColor: isDarkMode
                                  ? "rgba(255, 255, 255, 0.08)"
                                  : "rgba(0, 0, 0, 0.06)",
                              },
                            ]}
                            activeOpacity={0.75}
                            onPress={handleToggleHideFavorites}
                          >
                            <View style={styles.hideFavoritesLeft}>
                              <Ionicons
                                name={hideFavorites ? "eye-off-outline" : "eye-outline"}
                                size={20}
                                color={
                                  hideFavorites
                                    ? currentTheme.accent
                                    : !isDarkMode
                                    ? "rgba(0,0,0,0.6)"
                                    : "rgba(255,255,255,0.7)"
                                }
                                style={{ marginRight: 10 }}
                              />
                              <Text
                                style={[
                                  styles.hideFavoritesText,
                                  !isDarkMode && styles.hideFavoritesTextLight,
                                ]}
                              >
                                {hideFavorites
                                  ? "Favoritos ocultos (ver vazio)"
                                  : "Favoritos visíveis"}
                              </Text>
                            </View>
                            <View
                              style={[
                                styles.hideFavoritesBadge,
                                hideFavorites && {
                                  backgroundColor: currentTheme.accent,
                                },
                              ]}
                            >
                              <Text
                                style={[
                                  styles.hideFavoritesBadgeText,
                                  hideFavorites && { color: "#000000" },
                                ]}
                              >
                                {hideFavorites ? "Oculto" : "Visível"}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                          style={[
                            styles.saveButton,
                            { backgroundColor: currentTheme.accent },
                          ]}
                          onPress={saveProfile}
                          disabled={loadingData}
                        >
                          {loadingData ? (
                            <ActivityIndicator color="#000" />
                          ) : (
                            <Text style={styles.saveButtonText}>
                              Salvar Alterações
                            </Text>
                          )}
                        </TouchableOpacity>
                      </ScrollView>

                      <View style={styles.modalFooterRow}>
                        <TouchableOpacity
                          style={styles.logoutButton}
                          onPress={handleOpenLogoutModal}
                          activeOpacity={0.6}
                          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                        >
                          <Ionicons
                            name="log-out-outline"
                            size={17}
                            color="#FF3B30"
                          />
                          <Text style={styles.logoutText}>Sair</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          onPress={handleToggleTheme}
                          disabled={isThemeLoading}
                          activeOpacity={0.7}
                          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                          style={[
                            styles.themeToggleButton,
                            !isDarkMode
                              ? styles.themeToggleLight
                              : styles.themeToggleDark,
                          ]}
                        >
                          {isThemeLoading ? (
                            <ActivityIndicator
                              size="small"
                              color={currentTheme.accent}
                              style={{ transform: [{ scale: 0.75 }] }}
                            />
                          ) : (
                            <Animated.View
                              style={{ transform: [{ rotate: iconRotation }] }}
                            >
                              <Ionicons
                                name={isDarkMode ? "moon" : "sunny"}
                                size={14}
                                color={
                                  !isDarkMode
                                    ? "#000000"
                                    : currentTheme.accent
                                }
                              />
                            </Animated.View>
                          )}
                        </TouchableOpacity>
                      </View>
                    </Animated.View>
                  </TouchableWithoutFeedback>
                </View>
              </TouchableWithoutFeedback>
            </Modal>

            <Modal
              visible={logoutModalVisible}
              transparent={true}
              animationType="fade"
              statusBarTranslucent={true}
              navigationBarTranslucent={true}
              onRequestClose={handleCancelLogout}
            >
              <TouchableWithoutFeedback onPress={handleCancelLogout}>
                <View style={dialogStyles.overlay}>
                  <TouchableWithoutFeedback>
                    <View
                      style={[
                        dialogStyles.dialogCard,
                        !isDarkMode && dialogStyles.dialogCardLight,
                      ]}
                    >
                      <View style={dialogStyles.contentSection}>
                        <Text style={[dialogStyles.title, !isDarkMode && dialogStyles.titleLight]}>Sair da conta?</Text>
                        <Text style={[dialogStyles.message, !isDarkMode && dialogStyles.messageLight]}>
                          Tem certeza de que deseja sair? Você precisará fazer login novamente para acessar seus dados.
                        </Text>
                      </View>

                      <TouchableOpacity
                        style={[
                          dialogStyles.actionButton,
                          !isDarkMode && dialogStyles.actionButtonLight,
                        ]}
                        onPress={confirmLogout}
                        disabled={isLoggingOut}
                        activeOpacity={0.65}
                      >
                        {isLoggingOut ? (
                          <ActivityIndicator size="small" color="#FF3B30" />
                        ) : (
                          <Text style={dialogStyles.deleteText}>Sair</Text>
                        )}
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[
                          dialogStyles.actionButton,
                          dialogStyles.lastButton,
                          !isDarkMode && dialogStyles.actionButtonLight,
                        ]}
                        onPress={handleCancelLogout}
                        disabled={isLoggingOut}
                        activeOpacity={0.65}
                      >
                        <Text style={[dialogStyles.cancelText, !isDarkMode && dialogStyles.cancelTextLight]}>Cancelar</Text>
                      </TouchableOpacity>
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              </TouchableWithoutFeedback>
            </Modal>

            <Modal
              visible={avatarModalVisible}
              transparent={true}
              animationType="fade"
              statusBarTranslucent={true}
              navigationBarTranslucent={true}
              onRequestClose={() => !isUploadingAvatar && setAvatarModalVisible(false)}
            >
              <TouchableWithoutFeedback onPress={() => !isUploadingAvatar && setAvatarModalVisible(false)}>
                <View style={styles.avatarModalOverlay}>
                  <TouchableWithoutFeedback>
                    <View style={styles.avatarModalContent}>
                      <View style={styles.avatarModalImageWrapper}>
                        {user?.avatarUrl ? (
                          <Image
                            source={{ uri: user.avatarUrl }}
                            style={styles.avatarModalImage}
                            resizeMode="cover"
                          />
                        ) : (
                          <View style={styles.avatarModalPlaceholder}>
                            <Ionicons
                              name="person"
                              size={120}
                              color={currentTheme.accent}
                            />
                          </View>
                        )}
                        {isUploadingAvatar && (
                          <View style={styles.avatarUploadingOverlay}>
                            <ActivityIndicator size="large" color={currentTheme.accent} />
                          </View>
                        )}
                      </View>

                      <TouchableOpacity
                        style={[
                          styles.avatarEditBadge,
                          {
                            backgroundColor: isUploadingAvatar
                              ? "rgba(120, 120, 120, 0.35)"
                              : currentTheme.accent,
                            opacity: isUploadingAvatar ? 0.6 : 1,
                          },
                        ]}
                        activeOpacity={0.8}
                        disabled={isUploadingAvatar}
                        onPress={handlePickAndUploadAvatar}
                      >
                        <Ionicons
                          name="camera"
                          size={22}
                          color={isUploadingAvatar ? "rgba(255, 255, 255, 0.5)" : "#000000"}
                        />
                      </TouchableOpacity>
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              </TouchableWithoutFeedback>
            </Modal>

            <Modal
              visible={addCollectionModalVisible}
              transparent={true}
              animationType="fade"
              statusBarTranslucent={true}
              navigationBarTranslucent={true}
              onRequestClose={() => setAddCollectionModalVisible(false)}
            >
              <TouchableWithoutFeedback onPress={() => setAddCollectionModalVisible(false)}>
                <View style={styles.addCollectionModalOverlay}>
                  <TouchableWithoutFeedback>
                    <View
                      style={[
                        styles.addCollectionModalCard,
                        !isDarkMode && styles.addCollectionModalCardLight,
                      ]}
                    >
                      <View style={styles.addCollectionModalHeader}>
                        <Text
                          style={[
                            styles.addCollectionModalTitle,
                            !isDarkMode && styles.addCollectionModalTitleLight,
                          ]}
                        >
                          Adicionar coleção
                        </Text>
                      </View>

                      <Text
                        style={[
                          styles.addCollectionSectionTitle,
                          !isDarkMode && styles.addCollectionSectionTitleLight,
                          { marginTop: 12, marginBottom: 6 },
                        ]}
                      >
                        Nome
                      </Text>
                      <AnimatedProfileInput
                        isFocused={isCollectionNameFocused}
                        currentTheme={currentTheme}
                        isDarkMode={isDarkMode}
                        style={{ marginBottom: 4 }}
                        placeholder="Ex: viagem para europa, praias..."
                        placeholderTextColor={
                          !isDarkMode
                            ? "rgba(0, 0, 0, 0.40)"
                            : "rgba(255, 255, 255, 0.5)"
                        }
                        value={newCollectionName}
                        onChangeText={setNewCollectionName}
                        onFocus={() => setIsCollectionNameFocused(true)}
                        onBlur={() => setIsCollectionNameFocused(false)}
                      />

                      <Text
                        style={[
                          styles.addCollectionSectionTitle,
                          !isDarkMode && styles.addCollectionSectionTitleLight,
                          { marginTop: 4, marginBottom: 6 },
                        ]}
                      >
                        Fotos
                      </Text>
                      <TouchableOpacity
                        style={[
                          styles.addCollectionPhotoBox,
                          !isDarkMode && styles.addCollectionPhotoBoxLight,
                        ]}
                        activeOpacity={0.75}
                        onPress={() => {}}
                      >
                        <View
                          style={[
                            styles.addCollectionPhotoIconCircle,
                            { backgroundColor: `${currentTheme.accent}22` },
                          ]}
                        >
                          <Ionicons
                            name="cloud-upload-outline"
                            size={26}
                            color={currentTheme.accent}
                          />
                        </View>
                        <Text
                          style={[
                            styles.addCollectionPhotoTitle,
                            !isDarkMode && styles.addCollectionPhotoTitleLight,
                          ]}
                        >
                          Inserir fotos
                        </Text>
                        <Text
                          style={[
                            styles.addCollectionPhotoSubtitle,
                            !isDarkMode && styles.addCollectionPhotoSubtitleLight,
                          ]}
                        >
                          Toque para escolher fotos do dispositivo
                        </Text>
                      </TouchableOpacity>

                      <View style={styles.addCollectionModalActions}>
                        <TouchableOpacity
                          style={[
                            styles.addCollectionCancelBtn,
                            !isDarkMode && styles.addCollectionCancelBtnLight,
                          ]}
                          activeOpacity={0.7}
                          onPress={() => {
                            setNewCollectionName("");
                            setAddCollectionModalVisible(false);
                          }}
                        >
                          <Text
                            style={[
                              styles.addCollectionCancelText,
                              !isDarkMode && styles.addCollectionCancelTextLight,
                            ]}
                          >
                            Cancelar
                          </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={[
                            styles.addCollectionSaveBtn,
                            { backgroundColor: currentTheme.accent },
                          ]}
                          activeOpacity={0.8}
                          onPress={() => {
                            setNewCollectionName("");
                            setAddCollectionModalVisible(false);
                          }}
                        >
                          <Text style={styles.addCollectionSaveText}>
                            Salvar
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              </TouchableWithoutFeedback>
            </Modal>
          </SafeAreaView>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
}
