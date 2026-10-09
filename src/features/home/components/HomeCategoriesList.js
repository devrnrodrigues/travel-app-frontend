import React from "react";
import { View, ScrollView } from "react-native";
import { HomeCategoriesSkeleton } from "../../../shared/components/Skeleton";
import CategoryTabItem from "./CategoryTabItem";
import styles, { getCategoriesHeight } from "../styles/home.styles";

const HomeCategoriesList = React.memo(function HomeCategoriesList({
  categories = [],
  isLoadingCategories,
  activeCat,
  currentTheme,
  themesByCat,
  isDarkMode,
  dims,
  categoryScrollRef,
  onCategoryPress,
  onCategoryLayout,
  onContainerLayout,
  onContentSizeChange,
}) {
  if (categories.length === 0 && isLoadingCategories) {
    return (
      <View style={[styles.categoriesSection, getCategoriesHeight(dims.categoriesHeight)]}>
        <HomeCategoriesSkeleton isDarkMode={isDarkMode} />
      </View>
    );
  }

  if (categories.length === 0) {
    return null;
  }

  return (
    <View style={[styles.categoriesSection, getCategoriesHeight(dims.categoriesHeight)]}>
      <ScrollView
        ref={categoryScrollRef}
        horizontal
        nestedScrollEnabled={true}
        showsHorizontalScrollIndicator={false}
        onLayout={onContainerLayout}
        onContentSizeChange={onContentSizeChange}
        contentContainerStyle={styles.categoriesContainer}
      >
        {categories.map((catItem, index) => {
          const theme = themesByCat[index] || currentTheme;
          return (
            <CategoryTabItem
              key={catItem.id || catItem.slug || catItem.name || String(index)}
              cat={catItem.name}
              index={index}
              isActive={activeCat === index}
              accentColor={theme.accent}
              isDarkMode={isDarkMode}
              onLayout={(e) => onCategoryLayout(index, e.nativeEvent.layout)}
              onPress={() => onCategoryPress(index)}
            />
          );
        })}
      </ScrollView>
    </View>
  );
});

export default HomeCategoriesList;
