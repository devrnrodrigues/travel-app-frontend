import { useState, useRef, useEffect, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getProfileApi } from "../api/profileService";
import { getCollectionsApi } from "../api/collectionService";
import { getFavoritesApi } from "../../../shared/api/favoriteApi";
import { useAuth } from "../../../context/AuthContext";
import { useTheme } from "../../../theme/ThemeContext";

export default function useProfileData() {
  const { user, updateUser } = useAuth();
  const { aestheticMode, setAestheticMode } = useTheme();
  const queryClient = useQueryClient();

  const [name, setName] = useState(user?.fullName || "");
  const [nationality, setNationality] = useState(user?.nationality || "Brasileiro");
  const [bio, setBio] = useState(user?.bio || "");
  const [galleryCount, setGalleryCount] = useState(4);
  const [hideFavorites, setHideFavorites] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const hasSyncedInitialProfile = useRef(false);
  const userRef = useRef(user);

  useEffect(() => {
    userRef.current = user;
    if (user?.fullName) setName(user.fullName);
    if (user?.nationality) setNationality(user.nationality);
    if (user?.bio !== undefined && user?.bio !== null) setBio(user.bio);
  }, [user]);

  const { data: userCollections = [], refetch: refetchCollections, isLoading: loadingCollections } = useQuery({
    queryKey: ["collections"],
    queryFn: getCollectionsApi,
  });

  const { data: profileData, refetch: refetchProfile, isLoading: loadingProfile } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfileApi,
    staleTime: 1000 * 60,
  });

  const { data: favoritesData = [], refetch: refetchFavorites } = useQuery({
    queryKey: ["favorites", "profile_count"],
    queryFn: () => getFavoritesApi({ page: 0, size: 50 }),
    staleTime: 1000 * 60 * 2,
  });

  const favoritesCount = Array.isArray(favoritesData) ? favoritesData.length : 0;
  const commentsCount = profileData?.commentsCount ?? user?.commentsCount ?? 0;

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
        if (remoteUser.commentsCount !== undefined && remoteUser.commentsCount !== currentUser?.commentsCount) {
          updates.commentsCount = remoteUser.commentsCount;
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
      console.error(err);
    }
  }, [updateUser]);

  useEffect(() => {
    if (!hasSyncedInitialProfile.current) {
      hasSyncedInitialProfile.current = true;
      syncProfileWithBackend();
    }
  }, [syncProfileWithBackend]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        refetchProfile(),
        refetchCollections(),
        refetchFavorites(),
        syncProfileWithBackend(),
      ]);
    } catch (e) {
      console.error(e);
    } finally {
      setRefreshing(false);
    }
  }, [refetchProfile, refetchCollections, refetchFavorites, syncProfileWithBackend]);

  return {
    user,
    userCollections,
    loadingCollections,
    profileData,
    loadingProfile,
    favoritesCount,
    commentsCount,
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
    handleRefresh,
    queryClient,
  };
}
