import React, { useState, useCallback, useRef, useEffect, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Modal,
  ScrollView,
  RefreshControl,
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
  KeyboardAvoidingView,
  useWindowDimensions,
} from "react-native";

const { height: WINDOW_HEIGHT } = Dimensions.get("window");
const SCREEN_HEIGHT = Math.max(
  WINDOW_HEIGHT,
  Dimensions.get("screen").height || 0,
  900
);
const MODAL_DISMISS_OFFSET = SCREEN_HEIGHT + 50;
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useQueryClient, useQuery } from "@tanstack/react-query";
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
import { uploadAvatarApi, getProfileApi, updateProfileApi } from "./api/profileService";
import { createCollectionApi, getCollectionsApi } from "./api/collectionService";
import { getFavoritesApi } from "../favorites/api/favoriteService";
import profileNavBgImage from "../../../assets/images/profile-nav-bg.png";

export default function ProfileScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { user, logout, updateUser } = useAuth();
  const { currentTheme, isDarkMode, toggleThemeMode } = useTheme();
  const bgSource =
    typeof currentTheme.bg === "string" ? { uri: currentTheme.bg } : currentTheme.bg;

  const isFlorestas =
    currentTheme?.slug === "florestas" ||
    currentTheme?.name === "Florestas" ||
    currentTheme?.icon === "leaf";

  const [loading, setLoading] = useState(true);
  const [showSkeleton, setShowSkeleton] = useState(loading);
  const transitionAnim = useRef(new Animated.Value(loading ? 0 : 1)).current;
  const scrollY = useRef(new Animated.Value(0)).current;

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
  const [selectedCollectionPhotos, setSelectedCollectionPhotos] = useState([]);
  const [isPickingPhotos, setIsPickingPhotos] = useState(false);
  const [isCreatingCollection, setIsCreatingCollection] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const { data: userCollections = [], refetch: refetchCollections } = useQuery({
    queryKey: ["collections"],
    queryFn: getCollectionsApi,
  });

  const { data: favoritesData = [] } = useQuery({
    queryKey: ["favorites", "profile_count"],
    queryFn: () => getFavoritesApi({ page: 0, size: 50 }),
    staleTime: 1000 * 60 * 2,
  });
  const favoritesCount = Array.isArray(favoritesData) ? favoritesData.length : 0;

  const [name, setName] = useState("");
  const [nationality, setNationality] = useState("Brasileiro");
  const [bio, setBio] = useState("");
  const [galleryCount, setGalleryCount] = useState(4);
  const [hideFavorites, setHideFavorites] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const hasSyncedInitialProfile = useRef(false);
  const userRef = useRef(user);

  useEffect(() => {
    userRef.current = user;
  }, [user]);

  const syncProfileWithBackend = useCallback(async () => {
    try {
      const remoteUser = await getProfileApi();
      if (remoteUser) {
        const currentUser = userRef.current;
        const updates = {};
        if (remoteUser.avatarUrl !== undefined && remoteUser.avatarUrl !== currentUser?.avatarUrl) {
          updates.avatarUrl = remoteUser.avatarUrl;
        }
        if (remoteUser.fullName && remoteUser.fullName !== currentUser?.fullName) {
          updates.fullName = remoteUser.fullName;
          setName(remoteUser.fullName);
        }
        if (remoteUser.bio !== undefined && remoteUser.bio !== null) {
          updates.bio = remoteUser.bio;
          setBio(remoteUser.bio);
        }
        if (remoteUser.nationality) {
          updates.nationality = remoteUser.nationality;
          setNationality(remoteUser.nationality);
        }
        const userId = currentUser?.id || remoteUser.id;
        if (userId) {
          const storedProfileJson = await AsyncStorage.getItem(`profile_${userId}`);
          const parsed = storedProfileJson ? JSON.parse(storedProfileJson) : {};
          if (remoteUser.bio !== undefined && remoteUser.bio !== null) parsed.bio = remoteUser.bio;
          if (remoteUser.nationality) parsed.nationality = remoteUser.nationality;
          await AsyncStorage.setItem(`profile_${userId}`, JSON.stringify(parsed));
        }
        if (Object.keys(updates).length > 0) {
          await updateUser(updates);
        }
      }
    } catch (err) {
      console.error("Erro ao sincronizar perfil:", err);
    }
  }, [updateUser]);

  useEffect(() => {
    if (!hasSyncedInitialProfile.current) {
      hasSyncedInitialProfile.current = true;
      syncProfileWithBackend();
    }
  }, [syncProfileWithBackend]);

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

  const handlePickCollectionPhotos = async () => {
    if (isPickingPhotos || isCreatingCollection) return;
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert(
          "Permissão necessária",
          "É necessário permitir o acesso à galeria para selecionar fotos da coleção."
        );
        return;
      }

      setIsPickingPhotos(true);

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsMultipleSelection: true,
        quality: 0.8,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        return;
      }

      const compressedUris = [];
      for (let i = 0; i < result.assets.length; i++) {
        const a = result.assets[i];
        let finalUri = a.uri;
        try {
          const manipulated = await manipulateAsync(
            a.uri,
            [],
            { format: SaveFormat.WEBP, compress: 0.85 }
          );
          finalUri = manipulated.uri;
        } catch {
          finalUri = a.uri;
        }
        compressedUris.push(finalUri);
      }

      setSelectedCollectionPhotos((prev) => [...prev, ...compressedUris]);
    } catch {
      Alert.alert("Erro", "Não foi possível selecionar as fotos.");
    } finally {
      setIsPickingPhotos(false);
    }
  };

  const handleRemoveCollectionPhoto = (indexToRemove) => {
    setSelectedCollectionPhotos((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSaveCollection = async () => {
    const trimmedTitle = newCollectionName.trim();
    if (!trimmedTitle) {
      Alert.alert("Atenção", "Por favor, informe um nome para a coleção.");
      return;
    }
    if (trimmedTitle.length > 30) {
      Alert.alert("Atenção", "O nome da coleção deve ter no máximo 30 caracteres.");
      return;
    }
    if (!selectedCollectionPhotos || selectedCollectionPhotos.length === 0) {
      Alert.alert("Atenção", "Por favor, selecione ao menos uma foto.");
      return;
    }

    setIsCreatingCollection(true);
    try {
      await createCollectionApi({
        title: trimmedTitle,
        imageUris: selectedCollectionPhotos,
      });

      await queryClient.invalidateQueries({ queryKey: ["collections"] });
      setGalleryCount("*");
      await AsyncStorage.setItem("@profile_gallery_count", "*");
      if (user?.id) {
        const storedProfileJson = await AsyncStorage.getItem(`profile_${user.id}`);
        const parsed = storedProfileJson ? JSON.parse(storedProfileJson) : {};
        parsed.galleryCount = "*";
        await AsyncStorage.setItem(`profile_${user.id}`, JSON.stringify(parsed));
      }

      setNewCollectionName("");
      setSelectedCollectionPhotos([]);
      setAddCollectionModalVisible(false);
      Alert.alert("Sucesso", "Coleção criada com sucesso!");
    } catch (err) {
      const detail =
        (err?.data && typeof err.data === "object" && (err.data.message || err.data.error)) ||
        err?.message ||
        "Não foi possível criar a coleção.";
      Alert.alert("Erro ao criar coleção", String(detail));
    } finally {
      setIsCreatingCollection(false);
    }
  };

  const [isSearchingCountry, setIsSearchingCountry] = useState(false);
  const searchTimeoutRef = useRef(null);



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



  const loadProfile = useCallback(async () => {
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
          if (parsed.galleryCount === "*" || (parsed.galleryCount !== undefined && parsed.galleryCount >= 0 && parsed.galleryCount <= 8)) {
            setGalleryCount(parsed.galleryCount);
          } else {
            const savedCount = await AsyncStorage.getItem("@profile_gallery_count");
            if (savedCount === "*") {
              setGalleryCount("*");
            } else if (savedCount !== null && savedCount !== undefined) {
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
  }, [user]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["collections"] }),
        queryClient.invalidateQueries({ queryKey: ["profile"] }),
        queryClient.invalidateQueries({ queryKey: ["favorites"] }),
        refetchCollections(),
        syncProfileWithBackend(),
      ]);
      await loadProfile();
      setRefreshKey((prev) => prev + 1);
    } catch (err) {
      console.error("Erro no refresh:", err);
    } finally {
      setRefreshing(false);
    }
  }, [queryClient, syncProfileWithBackend, loadProfile, refetchCollections]);

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

      const updatedUser = await updateProfileApi({
        fullName: name,
        bio,
        nationality,
      });

      await updateUser({
        fullName: updatedUser?.fullName || name,
        bio: updatedUser?.bio !== undefined ? updatedUser.bio : bio,
        nationality: updatedUser?.nationality || nationality,
      });

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

  const displayedCollections = useMemo(() => {
    if (galleryCount === "*") {
      return userCollections || [];
    }
    const count = Number(galleryCount) || 0;
    if (count === 0) return [];
    return Array.from({ length: count }).map(
      (_, i) => GALLERY_COLLECTIONS[i % GALLERY_COLLECTIONS.length]
    );
  }, [galleryCount, userCollections]);

  const effectiveGalleryCount = displayedCollections.length;

  const { height: windowHeight } = useWindowDimensions();
  const BASE_HEIGHT = 680;
  const scale = Math.min(1, Math.max(0.65, windowHeight / BASE_HEIGHT));

  const bannerHeight = Math.round(230 * scale);
  const bodyOverlap = Math.round(24 * scale);
  const avatarSize = Math.round(102 * scale);
  const avatarMarginTop = -Math.round(52 * scale);
  const avatarMarginBottom = Math.round(12 * scale);
  const avatarBorderWidth = Math.round(4 * scale);
  const avatarIconSize = Math.round(42 * scale);

  const userNameFontSize = Math.round(21 * scale);
  const nationalityFontSize = Math.round(13.5 * scale);
  const nationalityMarginTop = Math.round(4 * scale);
  const nationalityMarginBottom = Math.round(8 * scale);

  const bioFontSize = Math.round(13 * scale);
  const bioLineHeight = Math.round(19 * scale);
  const bioMarginBottom = Math.round(20 * scale);

  const statsPaddingVertical = Math.round(18 * scale);
  const statsMarginBottom = Math.round(24 * scale);
  const statValueFontSize = Math.round(22 * scale);
  const statLabelFontSize = Math.round(11 * scale);
  const statDividerHeight = Math.round(32 * scale);

  const collectionsSectionMarginTop = Math.round(8 * scale);
  const collectionsHeaderMarginBottom = Math.round(12 * scale);
  const collectionsHeadingFontSize = Math.round(17 * scale);

  const cardWidth = Math.round(180 * scale);
  const cardHeight = Math.round(260 * scale);
  const cardBorderRadius = Math.round(22 * scale);

  const addCircleSize = Math.round(58 * scale);
  const addIconSize = Math.round(28 * scale);
  const addTextFontSize = Math.round(15 * scale);
  const addTextLineHeight = Math.round(20 * scale);

  const cardTitleFontSize = Math.round(15 * scale);
  const cardSubFontSize = Math.round(12 * scale);
  const cardGradientHeight = Math.round(95 * scale);
  const cardGradientPadding = Math.round(14 * scale);

  const [screenHeight, setScreenHeight] = useState(WINDOW_HEIGHT);
  const [bodyY, setBodyY] = useState(206);
  const [lastElementBottom, setLastElementBottom] = useState(570);
  const totalElementsBottom = bodyY + lastElementBottom;

  const handleRootLayout = useCallback((e) => {
    const h = e.nativeEvent.layout.height;
    if (h > 0 && Math.abs(h - screenHeight) > 1) {
      setScreenHeight(h);
    }
  }, [screenHeight]);

  const handleBodyLayout = useCallback((e) => {
    const y = e.nativeEvent.layout.y;
    if (y > 0 && Math.abs(y - bodyY) > 1) {
      setBodyY(y);
    }
  }, [bodyY]);

  const navBarHeight = 54 + insets.bottom;
  const isBehindNavbar = totalElementsBottom > screenHeight - navBarHeight;
  const canScroll = isBehindNavbar;

  const bottomNavBgOpacity = useMemo(() => {
    const threshold = totalElementsBottom - (screenHeight - 155);
    if (threshold <= 0) {
      return cardOpacity;
    }
    const fadeDistance = 40;
    const fadeStart = Math.max(0, threshold - fadeDistance);
    const fadeEnd = Math.max(fadeStart + 1, threshold);
    return scrollY.interpolate({
      inputRange: [fadeStart, fadeEnd],
      outputRange: [0, 1],
      extrapolate: "clamp",
    });
  }, [totalElementsBottom, screenHeight, scrollY, cardOpacity]);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDarkMode ? "#0C0C0E" : "#FFFFFF" },
      ]}
      onLayout={handleRootLayout}
    >
      <SafeAreaView edges={["bottom"]} style={styles.flex1}>
        <View style={styles.flex1}>
          <Animated.ScrollView
            style={styles.flex1}
            contentContainerStyle={[
              { flexGrow: 1 },
              canScroll && { paddingBottom: navBarHeight + 20 },
            ]}
            scrollEnabled={canScroll}
            showsVerticalScrollIndicator={canScroll}
            bounces={canScroll}
            alwaysBounceVertical={canScroll}
            pointerEvents={loading ? "none" : "auto"}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollY } } }],
              { useNativeDriver: Platform.OS !== "web" }
            )}
            scrollEventThrottle={16}
            refreshControl={
              canScroll ? (
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={handleRefresh}
                  tintColor={currentTheme?.accent || "#4CAF50"}
                  colors={[currentTheme?.accent || "#4CAF50"]}
                />
              ) : undefined
            }
          >
            <View key={refreshKey} style={styles.flex1}>
              <Animated.View style={{ opacity: cardOpacity }}>
                <ImageBackground
                  source={bgSource}
                  style={[styles.coverBanner, scale < 1 && { height: bannerHeight }]}
                  resizeMode="cover"
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
                    style={[styles.flex1, { width: "100%", height: "100%" }]}
                  >
                    <View style={styles.coverTopBar}>
                      <TouchableOpacity
                        style={styles.coverIconButton}
                        onPress={() => setModalVisible(true)}
                        activeOpacity={0.7}
                        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                      >
                        <Ionicons
                          name="settings-sharp"
                          size={20}
                          color="#FFFFFF"
                        />
                      </TouchableOpacity>
                    </View>
                  </LinearGradient>
                </ImageBackground>
              </Animated.View>

              <Animated.View
                style={[
                  styles.newProfileBody,
                  isDarkMode ? styles.newProfileBodyDark : styles.newProfileBodyLight,
                  {
                    opacity: cardOpacity,
                    flex: 1,
                    paddingBottom: 0,
                  },
                  scale < 1 && { marginTop: -bodyOverlap },
                ]}
                onLayout={handleBodyLayout}
              >
                <View style={styles.profileInfoGroup}>
                  <View
                    style={[
                      styles.avatarContainer,
                      scale < 1 && {
                        width: avatarSize,
                        height: avatarSize,
                        marginTop: avatarMarginTop,
                        marginBottom: avatarMarginBottom,
                      },
                    ]}
                  >
                    <TouchableOpacity
                      activeOpacity={0.85}
                      onPress={() => setAvatarModalVisible(true)}
                      delayLongPress={300}
                      onLongPress={() => setAvatarModalVisible(true)}
                    >
                      <View
                        style={[
                          styles.avatarBordered,
                          {
                            borderColor: isDarkMode ? "#0C0C0E" : "#FFFFFF",
                            backgroundColor: isDarkMode ? "#1A1A1E" : "#E5E7EB",
                          },
                          scale < 1 && {
                            width: avatarSize,
                            height: avatarSize,
                            borderRadius: avatarSize / 2,
                            borderWidth: avatarBorderWidth,
                          },
                        ]}
                      >
                        {user?.avatarUrl ? (
                          <Image
                            key={`avatar_${refreshKey}`}
                            source={{
                              uri: user.avatarUrl.includes("?")
                                ? `${user.avatarUrl}&t=${refreshKey}`
                                : `${user.avatarUrl}?t=${refreshKey}`,
                            }}
                            style={[
                              styles.avatarImageBig,
                              scale < 1 && {
                                width: avatarSize,
                                height: avatarSize,
                                borderRadius: avatarSize / 2,
                              },
                            ]}
                            resizeMode="cover"
                          />
                        ) : (
                          <Ionicons
                            name="person"
                            size={avatarIconSize}
                            color={currentTheme.accent}
                          />
                        )}
                      </View>
                    </TouchableOpacity>
                  </View>

                  <Text
                    style={[
                      styles.newUserName,
                      isDarkMode ? styles.newUserNameDark : styles.newUserNameLight,
                      scale < 1 && { fontSize: userNameFontSize },
                    ]}
                  >
                    {name || "Usuário"}
                  </Text>

                  <Text
                    style={[
                      styles.newNationalityText,
                      { color: currentTheme.accent },
                      scale < 1 && {
                        fontSize: nationalityFontSize,
                        marginTop: nationalityMarginTop,
                        marginBottom: nationalityMarginBottom,
                      },
                    ]}
                  >
                    {nationality || "Brasileiro"}
                  </Text>

                  <Text
                    style={[
                      styles.newBioText,
                      isDarkMode ? styles.newBioTextDark : styles.newBioTextLight,
                      scale < 1 && {
                        fontSize: bioFontSize,
                        lineHeight: bioLineHeight,
                        marginBottom: bioMarginBottom,
                      },
                    ]}
                  >
                    {bio || "Sem bio definida."}
                  </Text>

                  <View
                    style={[
                      styles.statsContainer,
                      isDarkMode ? styles.statsContainerDark : styles.statsContainerLight,
                      scale < 1 && {
                        paddingVertical: statsPaddingVertical,
                        marginBottom: statsMarginBottom,
                      },
                    ]}
                  >
                    <View style={styles.statItem}>
                      <Text
                        style={[
                          styles.statValue,
                          isDarkMode ? styles.statValueDark : styles.statValueLight,
                          scale < 1 && { fontSize: statValueFontSize },
                        ]}
                      >
                        0
                      </Text>
                      <Text
                        style={[
                          styles.statLabelText,
                          isDarkMode ? styles.statLabelTextDark : styles.statLabelTextLight,
                          scale < 1 && { fontSize: statLabelFontSize },
                        ]}
                      >
                        COMENTÁRIOS
                      </Text>
                    </View>

                    <View
                      style={[
                        styles.statDividerLine,
                        {
                          backgroundColor: isDarkMode
                            ? "rgba(255, 255, 255, 0.12)"
                            : "rgba(0, 0, 0, 0.08)",
                        },
                        scale < 1 && { height: statDividerHeight },
                      ]}
                    />

                    <View style={styles.statItem}>
                      <Text
                        style={[
                          styles.statValue,
                          isDarkMode ? styles.statValueDark : styles.statValueLight,
                          scale < 1 && { fontSize: statValueFontSize },
                        ]}
                      >
                        {displayedCollections.length}
                      </Text>
                      <Text
                        style={[
                          styles.statLabelText,
                          isDarkMode ? styles.statLabelTextDark : styles.statLabelTextLight,
                          scale < 1 && { fontSize: statLabelFontSize },
                        ]}
                      >
                        COLEÇÕES
                      </Text>
                    </View>

                    <View
                      style={[
                        styles.statDividerLine,
                        {
                          backgroundColor: isDarkMode
                            ? "rgba(255, 255, 255, 0.12)"
                            : "rgba(0, 0, 0, 0.08)",
                        },
                        scale < 1 && { height: statDividerHeight },
                      ]}
                    />

                    <View style={styles.statItem}>
                      <Text
                        style={[
                          styles.statValue,
                          isDarkMode ? styles.statValueDark : styles.statValueLight,
                          scale < 1 && { fontSize: statValueFontSize },
                        ]}
                      >
                        {favoritesCount}
                      </Text>
                      <Text
                        style={[
                          styles.statLabelText,
                          isDarkMode ? styles.statLabelTextDark : styles.statLabelTextLight,
                          scale < 1 && { fontSize: statLabelFontSize },
                        ]}
                      >
                        FAVORITOS
                      </Text>
                    </View>
                  </View>
                </View>

                <View
                  style={[
                    styles.collectionsSection,
                    scale < 1 && { marginTop: collectionsSectionMarginTop },
                  ]}
                >
                  <View
                    style={[
                      styles.collectionsHeader,
                      scale < 1 && { marginBottom: collectionsHeaderMarginBottom },
                    ]}
                  >
                    <Text
                      style={[
                        styles.collectionsHeading,
                        isDarkMode ? styles.collectionsHeadingDark : styles.collectionsHeadingLight,
                        scale < 1 && { fontSize: collectionsHeadingFontSize },
                      ]}
                    >
                      Minhas coleções
                    </Text>
                  </View>

                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={[
                      styles.collectionsScrollContent,
                      scale < 1 && {
                        gap: Math.round(14 * scale),
                        paddingTop: Math.round(6 * scale),
                        paddingBottom: Math.round(14 * scale),
                      },
                    ]}
                  >
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => setAddCollectionModalVisible(true)}
                    >
                      <LinearGradient
                        colors={
                          currentTheme?.colors && currentTheme.colors.length >= 2
                            ? [currentTheme.colors[0], currentTheme.colors[1]]
                            : [currentTheme.accent, "#7C3AED"]
                        }
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={[
                          styles.addCardItem,
                          scale < 1 && {
                            width: cardWidth,
                            height: cardHeight,
                            borderRadius: cardBorderRadius,
                          },
                        ]}
                      >
                        <View
                          style={[
                            styles.addCardCircle,
                            scale < 1 && {
                              width: addCircleSize,
                              height: addCircleSize,
                              borderRadius: addCircleSize / 2,
                              marginBottom: Math.round(14 * scale),
                            },
                          ]}
                        >
                          <Ionicons name="add" size={addIconSize} color="#FFFFFF" />
                        </View>
                        <Text
                          style={[
                            styles.addCardText,
                            scale < 1 && {
                              fontSize: addTextFontSize,
                              lineHeight: addTextLineHeight,
                            },
                          ]}
                        >
                          Adicionar{"\n"}coleção
                        </Text>
                      </LinearGradient>
                    </TouchableOpacity>

                    {displayedCollections.map((col, idx) => {
                      const coverUri =
                        col.photos?.[0]?.url ||
                        col.coverUrl ||
                        "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=600&q=80";

                      return (
                        <TouchableOpacity
                          key={col.id ? `${col.id}_${idx}` : `col_${idx}`}
                          style={[
                            styles.collectionCardItem,
                            scale < 1 && {
                              width: cardWidth,
                              height: cardHeight,
                              borderRadius: cardBorderRadius,
                            },
                          ]}
                          activeOpacity={0.85}
                          onPress={() =>
                            navigation.navigate("CollectionGallery", { collection: col })
                          }
                        >
                          <Image
                            source={{ uri: coverUri }}
                            style={styles.collectionCardImage}
                            resizeMode="cover"
                          />
                          <LinearGradient
                            colors={["transparent", "rgba(0, 0, 0, 0.88)"]}
                            style={[
                              styles.collectionCardGradient,
                              scale < 1 && {
                                height: cardGradientHeight,
                                padding: cardGradientPadding,
                              },
                            ]}
                          >
                            <Text
                              numberOfLines={1}
                              style={[
                                styles.collectionCardTitle,
                                scale < 1 && { fontSize: cardTitleFontSize },
                              ]}
                            >
                              {col.title}
                            </Text>
                            <Text
                              style={[
                                styles.collectionCardSub,
                                scale < 1 && { fontSize: cardSubFontSize },
                              ]}
                            >
                              {col.photos?.length || 0} {col.photos?.length === 1 ? "foto" : "fotos"}
                            </Text>
                          </LinearGradient>
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>
                </View>

                <View
                  style={{ height: 0 }}
                  onLayout={(e) => {
                    const y = e.nativeEvent.layout.y;
                    if (y > 0 && Math.abs(y - lastElementBottom) > 1) {
                      setLastElementBottom(y);
                    }
                  }}
                />
              </Animated.View>
            </View>
          </Animated.ScrollView>

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
                          paddingBottom: Math.max(insets.bottom + 16, 34),
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
                          <Text
                            style={[
                              styles.modalTitle,
                              !isDarkMode && styles.modalTitleLight,
                            ]}
                          >
                            Editar Perfil
                          </Text>
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
                          maxLength={20}
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
                          maxLength={150}
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
                            {[5, 6, 7, 8, "*"].map((num) => {
                              const isSelected = galleryCount === num;
                              return (
                                <TouchableOpacity
                                  key={String(num)}
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
              onRequestClose={() => {
                if (isCreatingCollection || isPickingPhotos) return;
                setAddCollectionModalVisible(false);
              }}
            >
              <TouchableWithoutFeedback
                onPress={() => {
                  if (isCreatingCollection || isPickingPhotos) return;
                  setAddCollectionModalVisible(false);
                }}
              >
                <View style={styles.addCollectionModalOverlay}>
                  <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : undefined}
                    style={{ width: "100%", maxWidth: 380, alignItems: "center" }}
                  >
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
                          maxLength={30}
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
                            selectedCollectionPhotos.length > 0 && { paddingVertical: 14 },
                          ]}
                          activeOpacity={0.75}
                          disabled={isCreatingCollection || isPickingPhotos}
                          onPress={handlePickCollectionPhotos}
                        >
                          {isPickingPhotos ? (
                            <View style={{ alignItems: "center", paddingVertical: 4 }}>
                              <ActivityIndicator
                                size="small"
                                color={currentTheme.accent}
                                style={{ marginBottom: 8 }}
                              />
                              <Text
                                style={[
                                  styles.addCollectionPhotoTitle,
                                  !isDarkMode && styles.addCollectionPhotoTitleLight,
                                ]}
                              >
                                Processando fotos...
                              </Text>
                            </View>
                          ) : (
                            <>
                            {selectedCollectionPhotos.length === 0 && (
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
                            )}
                              <Text
                                style={[
                                  styles.addCollectionPhotoTitle,
                                  !isDarkMode && styles.addCollectionPhotoTitleLight,
                                ]}
                              >
                                {selectedCollectionPhotos.length > 0
                                  ? `${selectedCollectionPhotos.length} foto${selectedCollectionPhotos.length > 1 ? "s" : ""} selecionada${selectedCollectionPhotos.length > 1 ? "s" : ""}`
                                  : "Inserir fotos"}
                              </Text>
                              <Text
                                style={[
                                  styles.addCollectionPhotoSubtitle,
                                  !isDarkMode && styles.addCollectionPhotoSubtitleLight,
                                ]}
                              >
                                {selectedCollectionPhotos.length > 0
                                  ? "Toque para adicionar mais fotos"
                                  : "Toque para escolher fotos do dispositivo"}
                              </Text>
                            </>
                          )}
                        </TouchableOpacity>

                        {selectedCollectionPhotos.length > 0 && (
                          <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            style={styles.selectedCollectionImagesScroll}
                            contentContainerStyle={styles.selectedCollectionImagesContent}
                          >
                            {selectedCollectionPhotos.map((uri, index) => (
                              <View key={uri + index} style={styles.selectedCollectionImageWrapper}>
                                <Image source={{ uri }} style={styles.selectedCollectionImageThumbnail} />
                                <TouchableOpacity
                                  style={styles.removeCollectionImageBadge}
                                  onPress={() => handleRemoveCollectionPhoto(index)}
                                  activeOpacity={0.7}
                                  hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                                >
                                  <Ionicons name="close" size={12} color="#FFFFFF" />
                                </TouchableOpacity>
                              </View>
                            ))}
                          </ScrollView>
                        )}

                        <View style={styles.addCollectionModalActions}>
                          <TouchableOpacity
                            style={[
                              styles.addCollectionCancelBtn,
                              !isDarkMode && styles.addCollectionCancelBtnLight,
                            ]}
                            activeOpacity={0.7}
                            disabled={isCreatingCollection || isPickingPhotos}
                            onPress={() => {
                              if (isCreatingCollection || isPickingPhotos) return;
                              setNewCollectionName("");
                              setSelectedCollectionPhotos([]);
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
                              (isCreatingCollection || isPickingPhotos) && { opacity: 0.7 },
                            ]}
                            activeOpacity={0.8}
                            disabled={isCreatingCollection || isPickingPhotos}
                            onPress={handleSaveCollection}
                          >
                            {isCreatingCollection ? (
                              <ActivityIndicator size="small" color="#000000" />
                            ) : (
                              <Text style={styles.addCollectionSaveText}>
                                Salvar
                              </Text>
                            )}
                          </TouchableOpacity>
                        </View>
                      </View>
                    </TouchableWithoutFeedback>
                  </KeyboardAvoidingView>
                </View>
              </TouchableWithoutFeedback>
            </Modal>
          </SafeAreaView>

          <Animated.View
            style={[
              styles.bottomNavBgContainer,
              { opacity: bottomNavBgOpacity },
            ]}
            pointerEvents="none"
          >
            <Image
              source={profileNavBgImage}
              style={[
                styles.bottomNavBgImage,
                isDarkMode && { opacity: 0.40 },
              ]}
              resizeMode="cover"
            />
            {isDarkMode && (
              <LinearGradient
                colors={[
                  "transparent",
                  "rgba(0, 0, 0, 0.45)",
                  "rgba(0, 0, 0, 0.85)",
                ]}
                style={StyleSheet.absoluteFillObject}
              />
            )}
          </Animated.View>
    </View>
  );
}
