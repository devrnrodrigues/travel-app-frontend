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
import ThemeModal from "./components/ThemeModal";
import {
  styles,
  getContainerStyle,
  getScrollContentContainerStyle,
  getProfileBodyDynamicStyle,
} from "./styles/profile.styles";

const BOTTOM_EDGES = ["bottom"];

export default function ProfileScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { logout, updateUser } = useAuth();
  const {
    currentTheme,
    isDarkMode,
    toggleThemeMode,
    themePreference,
    setThemePreference,
  } = useTheme();

  const [modalVisible, setModalVisible] = useState(false);
  const [themeModalVisible, setThemeModalVisible] = useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
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
    aestheticMode,
    setAestheticMode,
    hideFavorites,
    setHideFavorites,
    refreshing,
    handleRefresh: triggerRefresh,
    queryClient,
  } = useProfileData();

  const isMinimalist = aestheticMode === "minimalista";

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
  } = useProfileLayout(insets, isMinimalist);

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
    formErrors,
    setFormErrors,
    handlePickCollectionPhotos,
    handleRemoveCollectionPhoto,
    handleSaveCollection,
    handleCloseModal,
  } = useCreateCollection(queryClient);

  const bgSource = useMemo(() => {
    return typeof currentTheme.bg === "string"
      ? { uri: currentTheme.bg }
      : currentTheme.bg;
  }, [currentTheme.bg]);

  const displayedCollections = useMemo(() => {
    return userCollections || [];
  }, [userCollections]);

  const handleRefresh = useCallback(async () => {
    await triggerRefresh();
    setRefreshKey((prev) => prev + 1);
  }, [triggerRefresh]);

  const handleOpenSettings = useCallback(() => {
    setModalVisible(true);
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
    handleCloseModal();
  }, [handleCloseModal]);

  const handleOpenThemeModal = useCallback(() => {
    setThemeModalVisible(true);
  }, [setThemeModalVisible]);

  const handleCloseThemeModal = useCallback(() => {
    setThemeModalVisible(false);
  }, [setThemeModalVisible]);

  const handleNavigateToCollection = useCallback(
    (col) => {
      navigation.navigate("CollectionGallery", { collection: col });
    },
    [navigation]
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
    try {
      if (!user) return;

      const hasChanges =
        name !== user.fullName ||
        bio !== (user.bio || "") ||
        nationality !== (user.nationality || "Brasileiro");

      if (hasChanges) {
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
      }

      await AsyncStorage.setItem(
        `profile_${user.id}`,
        JSON.stringify({ nationality, bio, aestheticMode })
      );
      await AsyncStorage.setItem(
        "@profile_aesthetic_mode",
        aestheticMode
      );
    } catch (err) {
      console.error(err);
    }
  }, [user, name, bio, nationality, aestheticMode, updateUser]);

  const handleCloseEditModal = useCallback(() => {
    setModalVisible(false);
    handleSaveProfile();
  }, [handleSaveProfile]);

  useFocusEffect(
    useCallback(() => {
      AsyncStorage.getItem("@debug_hide_favorites").then((val) => {
        setHideFavorites(val === "true");
      });
      AsyncStorage.getItem("@profile_aesthetic_mode").then((val) => {
        if (val) {
          setAestheticMode(val);
        }
      });
    }, [setHideFavorites, setAestheticMode])
  );

  const refreshControl = (
    <RefreshControl
      refreshing={refreshing}
      onRefresh={handleRefresh}
      tintColor={currentTheme?.accent || "#4CAF50"}
      colors={[currentTheme?.accent || "#4CAF50"]}
      progressBackgroundColor={isDarkMode ? "#1A1A1A" : "#FFFFFF"}
    />
  );

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
            scrollEnabled={true}
            showsVerticalScrollIndicator={false}
            bounces={true}
            alwaysBounceVertical={true}
            overScrollMode="always"
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
          aestheticMode={aestheticMode}
          onAestheticModeChange={handleAestheticModeChange}
          hideFavorites={hideFavorites}
          onToggleHideFavorites={handleToggleHideFavorites}
          onOpenAvatarModal={handleOpenAvatarModal}
          onOpenAddCollectionModal={handleOpenAddCollectionModal}
          onOpenThemeModal={handleOpenThemeModal}
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
          formErrors={formErrors}
          setFormErrors={setFormErrors}
        />

        <ThemeModal
          visible={themeModalVisible}
          onClose={handleCloseThemeModal}
          isDarkMode={isDarkMode}
          currentTheme={currentTheme}
          themePreference={themePreference}
          onThemePreferenceChange={setThemePreference}
          aestheticMode={aestheticMode}
          onAestheticModeChange={handleAestheticModeChange}
        />
      </SafeAreaView>
    </View>
  );
}
