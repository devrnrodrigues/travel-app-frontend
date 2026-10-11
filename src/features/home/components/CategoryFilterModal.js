import React, { useMemo, useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  Animated,
  TouchableWithoutFeedback,
} from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import {
  filterModalStyles,
  getActiveItemBorderStyle,
  getActiveItemTextStyle,
  getModalTranslateStyle,
} from "../styles/filterModal.styles";
import useFilterModalSwipe from "../hooks/useFilterModalSwipe";
import { SkeletonBox } from "../../../shared/components/Skeleton";

const PAGE_SIZE = 15;
const SKELETON_WIDTHS = [110, 95, 130, 85, 120];

function CategoryFilterSkeletonList({ isDarkMode }) {
  return (
    <View style={{ width: "100%", paddingTop: 2 }}>
      {SKELETON_WIDTHS.map((w, idx) => (
        <View
          key={`cat-skel-${idx}`}
          style={[
            filterModalStyles.countryItem,
            isDarkMode ? filterModalStyles.countryItemDark : filterModalStyles.countryItemLight,
            { marginBottom: 8 },
          ]}
        >
          <View style={filterModalStyles.rowCenter}>
            <SkeletonBox
              width={22}
              height={22}
              borderRadius={6}
              isDarkMode={isDarkMode}
              style={{ marginRight: 10 }}
            />
            <SkeletonBox
              width={w}
              height={16}
              borderRadius={6}
              isDarkMode={isDarkMode}
            />
          </View>
        </View>
      ))}
    </View>
  );
}

const CATEGORY_ICON_MAP = {
  "todas": "compass-outline",
  "florestas": "tree",
  "floresta": "tree",
  "praias": "umbrella-beach",
  "praia": "umbrella-beach",
  "montanhas": "image-filter-hdr",
  "montanha": "image-filter-hdr",
  "ilhas": "island",
  "ilha": "island",
  "cidades": "city-variant-outline",
  "cidade": "city-variant-outline",
  "urbano": "city-variant-outline",
  "cachoeiras": "waterfall",
  "cachoeira": "waterfall",
  "desertos": "white-balance-sunny",
  "deserto": "white-balance-sunny",
  "canions": "terrain",
  "canion": "terrain",
  "penhascos": "elevation-rise",
  "penhasco": "elevation-rise",
  "vulcoes": "fire",
  "vulcao": "fire",
  "neve": "snowflake",
  "geleiras": "snowflake",
  "geleira": "snowflake",
  "cavernas": "tunnel-outline",
  "caverna": "tunnel-outline",
  "vales": "image-filter-hdr",
  "vale": "image-filter-hdr",
  "historico": "pillar",
  "surf": "surfing",
  "cultural": "palette-outline",
  "lagos": "water-outline",
  "lago": "water-outline",
  "rios": "waves",
  "rio": "waves",
  "interior": "home-variant-outline",
  "aventura": "bicycle",
  "costeiro": "compass-outline",
  "rural": "home-outline",
  "arquitetonico": "office-building",
  "arqueologico": "timer-sand",
  "recifes": "fish",
  "recife": "fish",
  "pantanos": "leaf",
  "pantano": "leaf",
  "termal": "hot-tub",
  "parques-nacionais": "pine-tree",
  "parques": "pine-tree",
  "parque": "pine-tree",
  "safari": "paw",
  "resorts": "umbrella-beach",
  "resort": "umbrella-beach",
  "vinhedos": "glass-wine",
  "vinhedo": "glass-wine",
  "castelos": "castle",
  "castelo": "castle",
  "mergulho": "diving-scuba",
  "gastronomia": "silverware-fork-knife",
  "mirantes": "binoculars",
  "mirante": "binoculars",
  "romantico": "heart-outline",
  "entretenimento": "ticket-outline",
  "trilhas": "hiking",
  "trilha": "hiking",
  "cidades-fluviais": "ferry",
};

const normalizeCategoryKey = (str) => {
  if (!str) return "";
  return String(str)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
};

const resolveCategoryIcon = (item) => {
  if (!item || item.key === null) return "compass-outline";

  const normalizedKey = normalizeCategoryKey(item.key);
  const normalizedName = normalizeCategoryKey(item.name);
  const normalizedIcon = normalizeCategoryKey(item.icon);

  if (CATEGORY_ICON_MAP[normalizedKey]) return CATEGORY_ICON_MAP[normalizedKey];
  if (CATEGORY_ICON_MAP[normalizedName]) return CATEGORY_ICON_MAP[normalizedName];
  if (CATEGORY_ICON_MAP[normalizedIcon]) return CATEGORY_ICON_MAP[normalizedIcon];

  if (item.icon && typeof item.icon === "string") {
    return item.icon;
  }

  return "compass-outline";
};

const CategoryFilterModal = React.memo(function CategoryFilterModal({
  visible,
  onClose,
  categories = [],
  selectedCategory,
  onSelectCategory,
  currentTheme,
  isDarkMode,
}) {
  const { slideAnim, fadeAnim, panResponder, handleCloseModal } = useFilterModalSwipe(visible, onClose);
  const [categoryPage, setCategoryPage] = useState(1);
  const [isListReady, setIsListReady] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    if (visible) {
      setIsListReady(false);
      setCategoryPage(1);

      const timer = setTimeout(() => {
        setIsListReady(true);
      }, 80);

      return () => clearTimeout(timer);
    } else {
      setIsListReady(false);
    }
  }, [visible]);

  const orderedCategories = useMemo(() => {
    const allOption = { key: null, name: "Todas as categorias" };
    if (!categories || categories.length === 0) {
      return [allOption];
    }

    const normalizedSelected = selectedCategory ? String(selectedCategory).toLowerCase() : null;
    let activeItem = null;
    const others = [];

    for (const cat of categories) {
      const catKey = cat?.slug || cat?.name || String(cat);
      const catName = cat?.name || cat?.title || catKey;
      const itemObj = {
        key: catKey,
        name: catName,
        icon: cat?.icon,
        slug: cat?.slug,
      };

      if (
        normalizedSelected &&
        (catKey.toLowerCase() === normalizedSelected || catName.toLowerCase() === normalizedSelected)
      ) {
        activeItem = itemObj;
      } else {
        others.push(itemObj);
      }
    }

    if (activeItem) {
      return [activeItem, allOption, ...others];
    }

    return [allOption, ...others];
  }, [categories, selectedCategory]);

  const paginatedCategories = useMemo(() => {
    return orderedCategories.slice(0, categoryPage * PAGE_SIZE);
  }, [orderedCategories, categoryPage]);

  const handleLoadMoreCategories = useCallback(() => {
    if (paginatedCategories.length < orderedCategories.length && !isLoadingMore) {
      setIsLoadingMore(true);
      setTimeout(() => {
        setCategoryPage((prev) => prev + 1);
        setIsLoadingMore(false);
      }, 100);
    }
  }, [paginatedCategories.length, orderedCategories.length, isLoadingMore]);

  const renderCategoryItem = useCallback(
    ({ item }) => {
      const isSelected =
        (!selectedCategory && item.key === null) ||
        (selectedCategory &&
          item.key &&
          String(selectedCategory).toLowerCase() === String(item.key).toLowerCase());

      return (
        <TouchableOpacity
          key={item.key || "all-categories"}
          onPress={() => {
            onSelectCategory(item.key);
            handleCloseModal();
          }}
          activeOpacity={0.7}
          style={[
            filterModalStyles.countryItem,
            isDarkMode ? filterModalStyles.countryItemDark : filterModalStyles.countryItemLight,
            isSelected && [
              isDarkMode ? filterModalStyles.countryItemActiveDark : filterModalStyles.countryItemActiveLight,
              getActiveItemBorderStyle(currentTheme.accent),
            ],
          ]}
        >
          <View style={filterModalStyles.rowCenter}>
            <MaterialCommunityIcons
              name={resolveCategoryIcon(item)}
              size={18}
              color={isSelected ? currentTheme.accent : !isDarkMode ? "#000000" : "#FFFFFF"}
              style={filterModalStyles.marginRight10}
            />
            <Text
              style={[
                filterModalStyles.countryName,
                isDarkMode ? filterModalStyles.countryNameDark : filterModalStyles.countryNameLight,
                isSelected && [
                  filterModalStyles.countryNameActive,
                  getActiveItemTextStyle(currentTheme.accent),
                ],
              ]}
            >
              {item.name}
            </Text>
          </View>
          {isSelected && (
            <Feather name="check" size={18} color={currentTheme.accent} />
          )}
        </TouchableOpacity>
      );
    },
    [selectedCategory, onSelectCategory, handleCloseModal, isDarkMode, currentTheme.accent]
  );

  const renderListFooter = useCallback(() => {
    if (paginatedCategories.length < orderedCategories.length) {
      return (
        <View style={{ paddingTop: 4, paddingBottom: 12 }}>
          <View
            style={[
              filterModalStyles.countryItem,
              isDarkMode ? filterModalStyles.countryItemDark : filterModalStyles.countryItemLight,
              { marginBottom: 8, opacity: 0.65 },
            ]}
          >
            <View style={filterModalStyles.rowCenter}>
              <SkeletonBox
                width={22}
                height={22}
                borderRadius={6}
                isDarkMode={isDarkMode}
                style={{ marginRight: 10 }}
              />
              <SkeletonBox
                width={100}
                height={16}
                borderRadius={6}
                isDarkMode={isDarkMode}
              />
            </View>
          </View>
        </View>
      );
    }
    return null;
  }, [paginatedCategories.length, orderedCategories.length, isDarkMode]);

  const keyExtractor = useCallback((item) => item.key || "all-categories", []);

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      statusBarTranslucent={true}
      navigationBarTranslucent={true}
      onRequestClose={handleCloseModal}
    >
      <TouchableWithoutFeedback onPress={handleCloseModal}>
        <Animated.View style={[filterModalStyles.overlay, { opacity: fadeAnim }]}>
          <TouchableWithoutFeedback>
            <Animated.View
              style={[
                filterModalStyles.sheet,
                isDarkMode ? filterModalStyles.sheetDark : filterModalStyles.sheetLight,
                getModalTranslateStyle(slideAnim),
              ]}
            >
              <View {...panResponder.panHandlers} style={filterModalStyles.dragHandleArea}>
                <View
                  style={[
                    filterModalStyles.indicator,
                    isDarkMode ? filterModalStyles.indicatorDark : filterModalStyles.indicatorLight,
                  ]}
                />
                <View style={filterModalStyles.header}>
                  <View>
                    <Text
                      style={[
                        filterModalStyles.title,
                        isDarkMode ? filterModalStyles.titleDark : filterModalStyles.titleLight,
                      ]}
                    >
                      Filtrar por Categoria
                    </Text>
                    <Text
                      style={[
                        filterModalStyles.subtitle,
                        isDarkMode ? filterModalStyles.subtitleDark : filterModalStyles.subtitleLight,
                      ]}
                    >
                      Selecione o tipo de experiência que busca
                    </Text>
                  </View>
                </View>
              </View>

              {!isListReady ? (
                <CategoryFilterSkeletonList isDarkMode={isDarkMode} />
              ) : (
                <FlatList
                  data={paginatedCategories}
                  keyExtractor={keyExtractor}
                  showsVerticalScrollIndicator={false}
                  style={filterModalStyles.countryListScroll}
                  keyboardShouldPersistTaps="handled"
                  onEndReached={handleLoadMoreCategories}
                  onEndReachedThreshold={0.5}
                  initialNumToRender={PAGE_SIZE}
                  maxToRenderPerBatch={PAGE_SIZE}
                  windowSize={5}
                  renderItem={renderCategoryItem}
                  ListFooterComponent={renderListFooter}
                />
              )}
            </Animated.View>
          </TouchableWithoutFeedback>
        </Animated.View>
      </TouchableWithoutFeedback>
    </Modal>
  );
});

export default CategoryFilterModal;
