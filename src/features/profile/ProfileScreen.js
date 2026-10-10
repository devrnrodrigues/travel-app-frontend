import React, { useState, useCallback, useMemo } from "react";
import {
  View,
  Animated,
  RefreshControl,
  Platform,
  Alert,
  Image,
  StyleSheet,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect } from "@react-navigation/native";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../theme/ThemeContext";
import { updateProfileApi } from "./api/profileService";
import { GALLERY_COLLECTIONS } from "./data/mockGallery";
import profileNavBgImage from "../../../assets/images/profile-nav-bg.png";
import useProfileData from "./hooks/useProfileData";
import useProfileAvatar from "./hooks/useProfileAvatar";
import useProfileLayout from "./hooks/useProfileLayout";
import useCreateCollection from "./hooks/useCreateCollection";
import ProfileHeader from "./components/ProfileHeader";
import ProfileUserCard from "./components/ProfileUserCard";
import ProfileCollectionsSection from "./components/ProfileCollectionsSection";
import EditProfileModal from "./components/EditProfileModal";
import LogoutConfirmationModal from "./components/LogoutConfirmationModal";
import AvatarViewerModal from "./components/AvatarViewerModal";
import AddCollectionModal from "./components/AddCollectionModal";
import {
  styles,
  getContainerStyle,
  getScrollContentContainerStyle,
  getProfileBodyDynamicStyle,
  getBottomNavBgContainerDynamicStyle,
} from "./styles/profile.styles";

const BOTTOM_EDGES = ["bottom"];
const GRADIENT_COLORS_DARK = [
  "transparent",
  "rgba(0, 0, 0, 0.45)",
  "rgba(0, 0, 0, 0.85)",
];

export default function ProfileScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { logout, updateUser } = useAuth();
  const { currentTheme, isDarkMode, toggleThemeMode } = useTheme();

  const [modalVisible, setModalVisible] = useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const {
    user,
    userCollections,
    loadingCollections,
    commentsCount,
    favoritesCount,
    name,
    setName,
    nationality,
    setNationality,
    bio,
    setBio,
    galleryCount,
    setGalleryCount,
    aestheticMode,
    setAestheticMode,
    hideFavorites,
    setHideFavorites,
    refreshing,
    handleRefresh: triggerRefresh,
    queryClient,
  } = useProfileData();

  const {
    avatarModalVisible,
    setAvatarModalVisible,
    isUploadingAvatar,
    handlePickAndUploadAvatar,
  } = useProfileAvatar();

  const {
    scale,
    bannerHeight,
    bodyOverlap,
    avatarDimensions,
    collectionDimensions,
    navBarHeight,
    canScroll,
    scrollY,
    bottomNavBgOpacity,
    handleRootLayout,
    handleBodyLayout,
    handleLastElementLayout,
  } = useProfileLayout(insets);

  const {
    addCollectionModalVisible,
    setAddCollectionModalVisible,
    newCollectionName,
    setNewCollectionName,
    isCollectionNameFocused,
    setIsCollectionNameFocused,
    selectedCollectionPhotos,
    isPickingPhotos,
    isCreatingCollection,
    handlePickCollectionPhotos,
    handleRemoveCollectionPhoto,
    handleSaveCollection,
  } = useCreateCollection(queryClient);

  const bgSource = useMemo(() => {
    return typeof currentTheme.bg === "string"
      ? { uri: currentTheme.bg }
      : currentTheme.bg;
  }, [currentTheme.bg]);

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

  const handleRefresh = useCallback(async () => {
    await triggerRefresh();
    setRefreshKey((prev) => prev + 1);
  }, [triggerRefresh]);

  const handleOpenSettings = useCallback(() => {
    setModalVisible(true);
  }, []);

  const handleCloseEditModal = useCallback(() => {
    setModalVisible(false);
  }, []);

  const handleOpenLogoutModal = useCallback(() => {
    setModalVisible(false);
    setLogoutModalVisible(true);
  }, []);

  const handleCancelLogout = useCallback(() => {
    if (isLoggingOut) return;
    setLogoutModalVisible(false);
  }, [isLoggingOut]);

  const confirmLogout = useCallback(async () => {
    setIsLoggingOut(true);
    try {
      await AsyncStorage.setItem("hasSeenGetStarted", "true");
      await logout();
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoggingOut(false);
      setLogoutModalVisible(false);
    }
  }, [logout]);

  const handleOpenAvatarModal = useCallback(() => {
    setAvatarModalVisible(true);
  }, [setAvatarModalVisible]);

  const handleCloseAvatarModal = useCallback(() => {
    setAvatarModalVisible(false);
  }, [setAvatarModalVisible]);

  const handleOpenAddCollectionModal = useCallback(() => {
    setAddCollectionModalVisible(true);
  }, [setAddCollectionModalVisible]);

  const handleCloseAddCollectionModal = useCallback(() => {
    setAddCollectionModalVisible(false);
  }, [setAddCollectionModalVisible]);

  const handleNavigateToCollection = useCallback(
    (col) => {
      navigation.navigate("CollectionGallery", { collection: col });
    },
    [navigation]
  );

  const handleGalleryCountChange = useCallback(
    async (count) => {
      setGalleryCount(count);
      try {
        await AsyncStorage.setItem("@profile_gallery_count", String(count));
        if (user) {
          const storedProfileJson = await AsyncStorage.getItem(
            `profile_${user.id}`
          );
          const parsed = storedProfileJson ? JSON.parse(storedProfileJson) : {};
          parsed.galleryCount = count;
          await AsyncStorage.setItem(
            `profile_${user.id}`,
            JSON.stringify(parsed)
          );
        }
      } catch (e) {
        console.error(e);
      }
    },
    [user, setGalleryCount]
  );

  const handleAestheticModeChange = useCallback(
    async (mode) => {
      setAestheticMode(mode);
      try {
        await AsyncStorage.setItem("@profile_aesthetic_mode", mode);
        if (user) {
          const storedProfileJson = await AsyncStorage.getItem(
            `profile_${user.id}`
          );
          const parsed = storedProfileJson ? JSON.parse(storedProfileJson) : {};
          parsed.aestheticMode = mode;
          await AsyncStorage.setItem(
            `profile_${user.id}`,
            JSON.stringify(parsed)
          );
        }
      } catch (e) {
        console.error(e);
      }
    },
    [user, setAestheticMode]
  );

  const handleToggleHideFavorites = useCallback(async () => {
    const nextVal = !hideFavorites;
    setHideFavorites(nextVal);
    await AsyncStorage.setItem("@debug_hide_favorites", String(nextVal));
    queryClient.setQueryData(["hideFavorites"], nextVal);
    queryClient.invalidateQueries({ queryKey: ["favorites"] });
  }, [hideFavorites, queryClient, setHideFavorites]);

  const handleSaveProfile = useCallback(async () => {
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
        JSON.stringify({ nationality, bio, galleryCount, aestheticMode })
      );
      await AsyncStorage.setItem(
        "@profile_gallery_count",
        String(galleryCount)
      );
      await AsyncStorage.setItem(
        "@profile_aesthetic_mode",
        aestheticMode
      );

      Alert.alert("Sucesso", "Perfil atualizado com sucesso!");
      setModalVisible(false);
    } catch (err) {
      Alert.alert("Erro ao salvar", err?.message || "Não foi possível salvar.");
    } finally {
      setLoadingData(false);
    }
  }, [user, name, bio, nationality, galleryCount, aestheticMode, updateUser]);

  useFocusEffect(
    useCallback(() => {
      AsyncStorage.getItem("@debug_hide_favorites").then((val) => {
        setHideFavorites(val === "true");
      });
      AsyncStorage.getItem("@profile_gallery_count").then((val) => {
        if (val !== null && val !== undefined) {
          if (val === "*") {
            setGalleryCount("*");
          } else {
            const parsed = parseInt(val, 10);
            if (parsed >= 0 && parsed <= 8) {
              setGalleryCount(parsed);
            }
          }
        }
      });
      AsyncStorage.getItem("@profile_aesthetic_mode").then((val) => {
        if (val) {
          setAestheticMode(val);
        }
      });
    }, [setHideFavorites, setGalleryCount, setAestheticMode])
  );

  const refreshControl = canScroll ? (
    <RefreshControl
      refreshing={refreshing}
      onRefresh={handleRefresh}
      tintColor={currentTheme?.accent || "#4CAF50"}
      colors={[currentTheme?.accent || "#4CAF50"]}
    />
  ) : undefined;

  return (
    <View
      style={[styles.container, getContainerStyle(isDarkMode)]}
      onLayout={handleRootLayout}
    >
      <SafeAreaView edges={BOTTOM_EDGES} style={styles.flex1}>
        <View style={styles.flex1}>
          <Animated.ScrollView
            style={styles.flex1}
            contentContainerStyle={getScrollContentContainerStyle(
              canScroll,
              navBarHeight
            )}
            scrollEnabled={canScroll}
            showsVerticalScrollIndicator={canScroll}
            bounces={canScroll}
            alwaysBounceVertical={canScroll}
            pointerEvents="auto"
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollY } } }],
              { useNativeDriver: Platform.OS !== "web" }
            )}
            scrollEventThrottle={16}
            refreshControl={refreshControl}
          >
            <View key={refreshKey} style={styles.flex1}>
              <ProfileHeader
                bgSource={bgSource}
                currentTheme={currentTheme}
                scale={scale}
                bannerHeight={bannerHeight}
                onOpenSettings={handleOpenSettings}
              />

              <Animated.View
                style={getProfileBodyDynamicStyle(
                  isDarkMode,
                  scale,
                  bodyOverlap
                )}
                onLayout={handleBodyLayout}
              >
                <ProfileUserCard
                  user={user}
                  name={name}
                  nationality={nationality}
                  bio={bio}
                  commentsCount={commentsCount}
                  collectionsCount={displayedCollections.length}
                  favoritesCount={favoritesCount}
                  refreshKey={refreshKey}
                  loading={loadingCollections}
                  isDarkMode={isDarkMode}
                  currentTheme={currentTheme}
                  scale={scale}
                  avatarDimensions={avatarDimensions}
                  onOpenAvatarModal={handleOpenAvatarModal}
                />

                <ProfileCollectionsSection
                  displayedCollections={displayedCollections}
                  loading={loadingCollections}
                  isDarkMode={isDarkMode}
                  currentTheme={currentTheme}
                  scale={scale}
                  collectionDimensions={collectionDimensions}
                  onOpenAddCollectionModal={handleOpenAddCollectionModal}
                  onNavigateToCollection={handleNavigateToCollection}
                />

                <View
                  style={styles.layoutAnchor}
                  onLayout={handleLastElementLayout}
                />
              </Animated.View>
            </View>
          </Animated.ScrollView>
        </View>

        <EditProfileModal
          visible={modalVisible}
          onClose={handleCloseEditModal}
          isDarkMode={isDarkMode}
          currentTheme={currentTheme}
          toggleThemeMode={toggleThemeMode}
          name={name}
          setName={setName}
          nationality={nationality}
          setNationality={setNationality}
          bio={bio}
          setBio={setBio}
          galleryCount={galleryCount}
          onGalleryCountChange={handleGalleryCountChange}
          aestheticMode={aestheticMode}
          onAestheticModeChange={handleAestheticModeChange}
          hideFavorites={hideFavorites}
          onToggleHideFavorites={handleToggleHideFavorites}
          onSaveProfile={handleSaveProfile}
          loadingData={loadingData}
          onOpenAvatarModal={handleOpenAvatarModal}
          onOpenAddCollectionModal={handleOpenAddCollectionModal}
          onOpenLogoutModal={handleOpenLogoutModal}
          insets={insets}
        />

        <LogoutConfirmationModal
          visible={logoutModalVisible}
          isLoggingOut={isLoggingOut}
          isDarkMode={isDarkMode}
          onConfirm={confirmLogout}
          onCancel={handleCancelLogout}
        />

        <AvatarViewerModal
          visible={avatarModalVisible}
          avatarUrl={user?.avatarUrl}
          isUploading={isUploadingAvatar}
          accentColor={currentTheme.accent}
          onClose={handleCloseAvatarModal}
          onPickAndUploadAvatar={handlePickAndUploadAvatar}
        />

        <AddCollectionModal
          visible={addCollectionModalVisible}
          onClose={handleCloseAddCollectionModal}
          isDarkMode={isDarkMode}
          currentTheme={currentTheme}
          newCollectionName={newCollectionName}
          setNewCollectionName={setNewCollectionName}
          isCollectionNameFocused={isCollectionNameFocused}
          setIsCollectionNameFocused={setIsCollectionNameFocused}
          selectedCollectionPhotos={selectedCollectionPhotos}
          isPickingPhotos={isPickingPhotos}
          isCreatingCollection={isCreatingCollection}
          onPickPhotos={handlePickCollectionPhotos}
          onRemovePhoto={handleRemoveCollectionPhoto}
          onSaveCollection={handleSaveCollection}
        />
      </SafeAreaView>

      <Animated.View
        style={getBottomNavBgContainerDynamicStyle(bottomNavBgOpacity)}
        pointerEvents="none"
      >
        <Image
          source={profileNavBgImage}
          style={[
            styles.bottomNavBgImage,
            isDarkMode && styles.bottomNavDarkOpacity,
          ]}
          resizeMode="cover"
        />
        {isDarkMode && (
          <LinearGradient
            colors={GRADIENT_COLORS_DARK}
            style={StyleSheet.absoluteFillObject}
          />
        )}
      </Animated.View>
    </View>
  );
}
