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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
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

export default function ProfileScreen({ navigation }) {
  const { user, logout, updateUser } = useAuth();
  const { currentTheme, isDarkMode, toggleThemeMode } = useTheme();
  const bgSource =
    typeof currentTheme.bg === "string" ? { uri: currentTheme.bg } : currentTheme.bg;

  const [loading, setLoading] = useState(true);
  const [loadingData, setLoadingData] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const [name, setName] = useState("");
  const [nationality, setNationality] = useState("Brasileiro");
  const [bio, setBio] = useState("");
  const [focusedInput, setFocusedInput] = useState(null);
  const [hasTypedNationality, setHasTypedNationality] = useState(false);

  const isNationalityFocused = focusedInput === "nationality";
  const countryListAnim = useRef(new Animated.Value(0)).current;
  const blurTimeoutRef = useRef(null);

  const [isSearchingCountry, setIsSearchingCountry] = useState(false);
  const searchTimeoutRef = useRef(null);

  useEffect(() => {
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

  const modalSlideAnim = useRef(new Animated.Value(600)).current;
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

  useEffect(() => {
    if (modalVisible) {
      modalSlideAnim.setValue(600);
      Animated.spring(modalSlideAnim, {
        toValue: 0,
        damping: 24,
        stiffness: 220,
        useNativeDriver: true,
      }).start();
    }
  }, [modalVisible, modalSlideAnim]);

  const handleCloseModal = useCallback(() => {
    Animated.timing(modalSlideAnim, {
      toValue: 600,
      duration: 180,
      useNativeDriver: true,
    }).start(() => {
      setModalVisible(false);
    });
  }, [modalSlideAnim]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return gestureState.dy > 5;
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          modalSlideAnim.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 100 || gestureState.vy > 0.5) {
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
        }
      }
    } catch (err) {
      console.error("Erro ao carregar perfil:", err);
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async () => {
    setLoadingData(true);
    try {
      if (!user) throw new Error("Usuário não autenticado");

      await updateUser({ fullName: name });
      await AsyncStorage.setItem(
        `profile_${user.id}`,
        JSON.stringify({ nationality, bio })
      );

      Alert.alert("Sucesso", "Perfil atualizado com sucesso!");
      setModalVisible(false);
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
      <ImageBackground source={bgSource} style={styles.flex1} resizeMode="cover">
        <LinearGradient
          colors={["rgba(0, 0, 0, 0.50)", "rgba(0, 0, 0, 0.68)"]}
          style={styles.flex1}
        >
          <SafeAreaView style={styles.flex1}>
            {loading ? (
              <ProfileSkeleton isDarkMode={isDarkMode} />
            ) : (
              <FadeInView duration={260} style={styles.flex1}>
                <View
                  style={[
                    styles.profileCard,
                    !isDarkMode && styles.profileCardLight,
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

                  <View
                    style={[
                      styles.avatar,
                      !isDarkMode && styles.avatarLight,
                    ]}
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
                  </View>
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
                </View>

                <View style={styles.galleryContainer}>
                  <View style={styles.galleryRow}>
                    <PolaroidStackCard
                      item={GALLERY_COLLECTIONS[0]}
                      isDarkMode={isDarkMode}
                      currentTheme={currentTheme}
                    />
                    <PolaroidStackCard
                      item={GALLERY_COLLECTIONS[1]}
                      isDarkMode={isDarkMode}
                      currentTheme={currentTheme}
                    />
                  </View>
                  <View style={styles.galleryRow}>
                    <PolaroidStackCard
                      item={GALLERY_COLLECTIONS[2]}
                      isDarkMode={isDarkMode}
                      currentTheme={currentTheme}
                    />
                    <PolaroidStackCard
                      item={GALLERY_COLLECTIONS[3]}
                      isDarkMode={isDarkMode}
                      currentTheme={currentTheme}
                    />
                  </View>
                </View>
              </FadeInView>
            )}

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
                              color="#FFFFFF"
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
                              ? "rgba(255, 255, 255, 0.65)"
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
                          style={styles.bioInput}
                          placeholder="Conte um pouco sobre você..."
                          placeholderTextColor={
                            !isDarkMode
                              ? "rgba(255, 255, 255, 0.65)"
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
                          onPress={toggleThemeMode}
                          activeOpacity={0.7}
                          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                          style={[
                            styles.themeToggleButton,
                            !isDarkMode
                              ? styles.themeToggleLight
                              : styles.themeToggleDark,
                          ]}
                        >
                          <Animated.View
                            style={{ transform: [{ rotate: iconRotation }] }}
                          >
                            <Ionicons
                              name={isDarkMode ? "moon" : "sunny"}
                              size={14}
                              color={
                                !isDarkMode
                                  ? "#FFFFFF"
                                  : currentTheme.accent
                              }
                            />
                          </Animated.View>
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
                        <Text style={dialogStyles.title}>Sair da conta?</Text>
                        <Text style={dialogStyles.message}>
                          Tem certeza de que deseja sair? Você precisará fazer login novamente para acessar seus dados.
                        </Text>
                      </View>

                      <TouchableOpacity
                        style={dialogStyles.actionButton}
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
                        ]}
                        onPress={handleCancelLogout}
                        disabled={isLoggingOut}
                        activeOpacity={0.65}
                      >
                        <Text style={dialogStyles.cancelText}>Cancelar</Text>
                      </TouchableOpacity>
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
