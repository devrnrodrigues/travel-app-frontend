import { useState, useRef, useCallback, useMemo, useEffect } from "react";
import { Alert, Animated, Easing } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { updateProfileApi } from "../api/profileService";
import { ALL_COUNTRIES } from "../data/countries";
import { useAuth } from "../../../context/AuthContext";

export default function useProfileEdit({
  name,
  setName,
  nationality,
  setNationality,
  bio,
  setBio,
}) {
  const { user, updateUser } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);
  const [hasTypedNationality, setHasTypedNationality] = useState(false);

  const countryListAnim = useRef(new Animated.Value(0)).current;

  const isNationalityFocused = focusedInput === "nationality";

  useEffect(() => {
    Animated.timing(countryListAnim, {
      toValue: isNationalityFocused ? 1 : 0,
      duration: 220,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [isNationalityFocused, countryListAnim]);

  const filteredCountries = useMemo(() => {
    const query = nationality.trim().toLowerCase();
    if (!query) return ALL_COUNTRIES.slice(0, 8);
    const starts = ALL_COUNTRIES.filter((c) =>
      c.name.toLowerCase().startsWith(query)
    );
    const contains = ALL_COUNTRIES.filter(
      (c) =>
        !c.name.toLowerCase().startsWith(query) &&
        c.name.toLowerCase().includes(query)
    );
    return [...starts, ...contains].slice(0, 8);
  }, [nationality]);

  const handleSelectCountry = useCallback((countryName) => {
    setNationality(countryName);
    setHasTypedNationality(false);
    setFocusedInput(null);
  }, [setNationality]);

  const handleSaveProfile = useCallback(async () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      Alert.alert("Atenção", "O nome não pode ficar vazio.");
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        fullName: trimmedName,
        nationality: nationality.trim() || "Brasileiro",
        bio: bio.trim(),
      };

      await updateProfileApi(payload);

      const userId = user?.id;
      if (userId) {
        const storedProfileJson = await AsyncStorage.getItem(`profile_${userId}`);
        const parsed = storedProfileJson ? JSON.parse(storedProfileJson) : {};
        parsed.bio = payload.bio;
        parsed.nationality = payload.nationality;
        await AsyncStorage.setItem(`profile_${userId}`, JSON.stringify(parsed));
      }

      await updateUser({
        fullName: payload.fullName,
        nationality: payload.nationality,
        bio: payload.bio,
      });

      setModalVisible(false);
    } catch (err) {
      console.error(err);
      Alert.alert("Erro", "Não foi possível atualizar o perfil.");
    } finally {
      setIsSaving(false);
    }
  }, [name, nationality, bio, user?.id, updateUser]);

  return {
    modalVisible,
    setModalVisible,
    isSaving,
    focusedInput,
    setFocusedInput,
    hasTypedNationality,
    setHasTypedNationality,
    countryListAnim,
    filteredCountries,
    handleSelectCountry,
    handleSaveProfile,
  };
}
