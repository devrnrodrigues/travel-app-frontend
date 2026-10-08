import React, { memo, useCallback } from "react";
import {
  View,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated,
  FlatList,
  ActivityIndicator,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AnimatedProfileInput from "./AnimatedProfileInput";
import { CountryPillSkeletonGroup } from "./CountryPillSkeleton";
import useEditProfileModal from "../hooks/useEditProfileModal";
import {
  styles,
  getModalContentDynamicStyle,
  getCountryListContainerDynamicStyle,
  getCountryPillStyle,
  getFlagIconContainerStyle,
  getCountryPillTextStyle,
  getCollectionCountBtnStyle,
  getCollectionCountTextStyle,
  getHideFavoritesBtnDynamicStyle,
  getHideFavoritesBadgeDynamicStyle,
  getHideFavoritesBadgeTextStyle,
  getSaveButtonStyle,
  getRotationStyle,
} from "../styles/profile.styles";

const HIT_SLOP_12 = { top: 12, bottom: 12, left: 12, right: 12 };
const GALLERY_COUNT_ROW_1 = [0, 1, 2, 3, 4];
const GALLERY_COUNT_ROW_2 = [5, 6, 7, 8, "*"];

const EditProfileModal = memo(function EditProfileModal({
  visible,
  onClose,
  isDarkMode,
  currentTheme,
  toggleThemeMode,
  name,
  setName,
  nationality,
  setNationality,
  bio,
  setBio,
  galleryCount,
  onGalleryCountChange,
  hideFavorites,
  onToggleHideFavorites,
  onSaveProfile,
  loadingData,
  onOpenAvatarModal,
  onOpenAddCollectionModal,
  onOpenLogoutModal,
  insets,
}) {
  const {
    focusedInput,
    setFocusedInput,
    isNationalityFocused,
    isSearchingCountry,
    countryListHeight,
    countryListOpacity,
    countryListMargin,
    paginatedCountries,
    filteredCountries,
    handleNationalityFocus,
    handleNationalityBlur,
    handleNationalityChange,
    handleSelectCountry,
    handleLoadMoreCountries,
    modalSlideAnim,
    handleCloseModal,
    panResponder,
    iconRotation,
    isThemeLoading,
    handleToggleTheme,
  } = useEditProfileModal({
    visible,
    onClose,
    isDarkMode,
    toggleThemeMode,
    nationality,
    setNationality,
  });

  const modalPaddingBottom = Math.max(insets.bottom + 16, 34);

  const renderCountryItem = useCallback(
    ({ item }) => {
      const isSelected =
        nationality.trim().toLowerCase() === item.label.toLowerCase() ||
        nationality.trim().toLowerCase() === item.country.toLowerCase();

      return (
        <TouchableOpacity
          key={`${item.code}-${item.label}`}
          style={getCountryPillStyle(isSelected, currentTheme.accent, isDarkMode)}
          onPress={() => handleSelectCountry(item.label)}
          activeOpacity={0.7}
        >
          <View style={getFlagIconContainerStyle(isDarkMode)}>
            <Image
              source={{ uri: `https://flagcdn.com/w40/${item.code}.png` }}
              style={styles.flagIcon}
              resizeMode="cover"
            />
          </View>
          <Text style={getCountryPillTextStyle(isSelected, isDarkMode)}>
            {item.label}
          </Text>
        </TouchableOpacity>
      );
    },
    [nationality, isDarkMode, currentTheme.accent, handleSelectCountry]
  );

  const renderListFooter = useCallback(() => {
    if (paginatedCountries.length < filteredCountries.length) {
      return (
        <View style={styles.footerCountrySkeletonWrapper}>
          <CountryPillSkeletonGroup isDarkMode={isDarkMode} count={2} />
        </View>
      );
    }
    return null;
  }, [paginatedCountries.length, filteredCountries.length, isDarkMode]);

  const renderListEmpty = useCallback(() => {
    return (
      <View style={styles.footerEmptyCountryWrapper}>
        <Text
          style={
            !isDarkMode
              ? styles.footerEmptyCountryTextLight
              : styles.footerEmptyCountryTextDark
          }
        >
          Nenhum país encontrado
        </Text>
      </View>
    );
  }, [isDarkMode]);

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
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
                getModalContentDynamicStyle(modalSlideAnim, modalPaddingBottom),
                !isDarkMode && styles.modalContentLight,
              ]}
            >
              <View {...panResponder.panHandlers} style={styles.dragHandleArea}>
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

              <ScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                style={styles.modalScroll}
              >
                <Text style={[styles.label, !isDarkMode && styles.labelLight]}>
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

                <Text style={[styles.label, !isDarkMode && styles.labelLight]}>
                  Nacionalidade
                </Text>
                <AnimatedProfileInput
                  isFocused={isNationalityFocused}
                  currentTheme={currentTheme}
                  isDarkMode={isDarkMode}
                  maxLength={20}
                  style={isNationalityFocused ? styles.nationalityFocusedInput : null}
                  value={nationality}
                  onChangeText={handleNationalityChange}
                  onFocus={handleNationalityFocus}
                  onBlur={handleNationalityBlur}
                />

                <Animated.View
                  style={getCountryListContainerDynamicStyle(
                    countryListHeight,
                    countryListOpacity,
                    countryListMargin
                  )}
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

                <Text style={[styles.label, !isDarkMode && styles.labelLight]}>
                  Bio
                </Text>
                <AnimatedProfileInput
                  isFocused={focusedInput === "bio"}
                  currentTheme={currentTheme}
                  isDarkMode={isDarkMode}
                  style={[styles.bioInput, styles.bioInputMargin]}
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
                    styles.addCollectionTriggerBtnSpacing,
                  ]}
                  activeOpacity={0.75}
                  onPress={onOpenAvatarModal}
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
                    color={
                      !isDarkMode
                        ? "rgba(0, 0, 0, 0.4)"
                        : "rgba(255, 255, 255, 0.4)"
                    }
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.addCollectionTriggerBtn,
                    !isDarkMode && styles.addCollectionTriggerBtnLight,
                    styles.addCollectionTriggerBtnNoTopMargin,
                  ]}
                  activeOpacity={0.75}
                  onPress={onOpenAddCollectionModal}
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
                    color={
                      !isDarkMode
                        ? "rgba(0, 0, 0, 0.4)"
                        : "rgba(255, 255, 255, 0.4)"
                    }
                  />
                </TouchableOpacity>

                <Text
                  style={[
                    styles.label,
                    !isDarkMode && styles.labelLight,
                    styles.labelMarginTop,
                  ]}
                >
                  Coleções na galeria
                </Text>
                <View style={styles.collectionCountGrid}>
                  <View style={styles.collectionCountRow}>
                    {GALLERY_COUNT_ROW_1.map((num) => {
                      const isSelected = galleryCount === num;
                      return (
                        <TouchableOpacity
                          key={num}
                          style={getCollectionCountBtnStyle(
                            isSelected,
                            currentTheme.accent,
                            isDarkMode
                          )}
                          activeOpacity={0.75}
                          onPress={() => onGalleryCountChange(num)}
                        >
                          <Text
                            style={getCollectionCountTextStyle(
                              isSelected,
                              isDarkMode
                            )}
                          >
                            {num}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                  <View style={styles.collectionCountRow}>
                    {GALLERY_COUNT_ROW_2.map((num) => {
                      const isSelected = galleryCount === num;
                      return (
                        <TouchableOpacity
                          key={String(num)}
                          style={getCollectionCountBtnStyle(
                            isSelected,
                            currentTheme.accent,
                            isDarkMode
                          )}
                          activeOpacity={0.75}
                          onPress={() => onGalleryCountChange(num)}
                        >
                          <Text
                            style={getCollectionCountTextStyle(
                              isSelected,
                              isDarkMode
                            )}
                          >
                            {num}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>

                <View style={styles.hideFavoritesSection}>
                  <Text style={[styles.label, !isDarkMode && styles.labelLight]}>
                    Visualização dos Favoritos
                  </Text>
                  <TouchableOpacity
                    style={getHideFavoritesBtnDynamicStyle(
                      hideFavorites,
                      currentTheme.accent,
                      isDarkMode
                    )}
                    activeOpacity={0.75}
                    onPress={onToggleHideFavorites}
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
                        style={styles.hideFavoritesIcon}
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
                      style={getHideFavoritesBadgeDynamicStyle(
                        hideFavorites,
                        currentTheme.accent
                      )}
                    >
                      <Text
                        style={getHideFavoritesBadgeTextStyle(hideFavorites)}
                      >
                        {hideFavorites ? "Oculto" : "Visível"}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={[
                    styles.saveButton,
                    getSaveButtonStyle(currentTheme.accent),
                  ]}
                  onPress={onSaveProfile}
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
                  onPress={onOpenLogoutModal}
                  activeOpacity={0.6}
                  hitSlop={HIT_SLOP_12}
                >
                  <Ionicons name="log-out-outline" size={17} color="#FF3B30" />
                  <Text style={styles.logoutText}>Sair</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleToggleTheme}
                  disabled={isThemeLoading}
                  activeOpacity={0.7}
                  hitSlop={HIT_SLOP_12}
                  style={[
                    styles.themeToggleButton,
                    !isDarkMode ? styles.themeToggleLight : styles.themeToggleDark,
                  ]}
                >
                  {isThemeLoading ? (
                    <ActivityIndicator
                      size="small"
                      color={currentTheme.accent}
                      style={styles.themeIndicator}
                    />
                  ) : (
                    <Animated.View style={getRotationStyle(iconRotation)}>
                      <Ionicons
                        name={isDarkMode ? "moon" : "sunny"}
                        size={14}
                        color={
                          !isDarkMode ? "#000000" : currentTheme.accent
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
  );
});

export default EditProfileModal;
