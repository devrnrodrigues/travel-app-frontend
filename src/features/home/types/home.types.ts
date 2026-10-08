import { ImageSourcePropType } from "react-native";
import { NormalizedDestination } from "../../../shared/types/destination.types";

export interface CategoryItem {
  id?: string;
  name: string;
  slug?: string;
  title?: string;
  icon?: string | null;
  accentColor?: string | null;
  bgImageUrl?: string | null;
  sortOrder?: number | null;
  active?: boolean | null;
  isPrimary?: boolean | null;
}

export interface HomeTheme {
  name?: string;
  accent: string;
  bg?: string | ImageSourcePropType;
  colors?: string[];
  tabBarBg?: string;
  activeTint?: string;
  inactiveTint?: string;
}

export interface HomeDimensions {
  windowWidth: number;
  windowHeight: number;
  availableHeight: number;
  isSmallScreen: boolean;
  isTallScreen: boolean;
  headerPaddingTop: number;
  headerTitleSize: number;
  iconPadding: number;
  categoriesHeight: number;
  cardHeight: number;
  cardWidth: number;
  cardInfoBottom: number;
  cardInfoHeight: number;
  topCardHeight: number;
  topCardWidth: number;
  topCardImageSize: number;
  topDestTitleSize: number;
  topDestHeaderMarginBottom: number;
  bottomBarHeight: number;
  bottomSpacing: number;
}

export type SearchSortBy =
  | "name_asc"
  | "name_desc"
  | "rating_desc"
  | "rating_asc"
  | "price_asc"
  | "price_desc";

export interface CategoryTabItemProps {
  cat: string;
  index: number;
  isActive: boolean;
  accentColor: string;
  isDarkMode?: boolean;
  onPress: () => void;
  onLayout: (e: any) => void;
}

export interface HomeCardItemProps {
  item: NormalizedDestination;
  currentTheme: HomeTheme;
  isDarkMode: boolean;
  navigation: any;
  cardWidth?: number;
  cardHeight?: number;
  cardInfoBottom?: number;
  cardInfoHeight?: number;
}

export interface TopDestinationCardProps {
  item: NormalizedDestination;
  currentTheme: HomeTheme;
  isDarkMode?: boolean;
  navigation: any;
  cardWidth?: number;
  cardHeight?: number;
  imageSize?: number;
  titleSize?: number;
  locationSize?: number;
}

export interface SearchCardItemProps {
  item: NormalizedDestination;
  cardHeight: number;
  cardMarginBottom: number;
  currentTheme: HomeTheme;
  isDarkMode: boolean;
  isOverlayActive?: boolean;
  showPrice?: boolean;
  showRating?: boolean;
  onPress: () => void;
}

export interface SearchModalProps {
  visible: boolean;
  onClose: () => void;
  initialCategory?: string | null;
  categories?: CategoryItem[];
  currentTheme: HomeTheme;
  isDarkMode: boolean;
  navigation: any;
  bgSource?: ImageSourcePropType | null;
}

export interface CategoryFilterModalProps {
  visible: boolean;
  onClose: () => void;
  categories?: CategoryItem[];
  selectedCategory?: string | null;
  onSelectCategory: (categoryKey: string | null) => void;
  currentTheme: HomeTheme;
  isDarkMode: boolean;
}

export interface CountryFilterModalProps {
  visible: boolean;
  onClose: () => void;
  destinations?: NormalizedDestination[];
  selectedCountry?: string | null;
  onSelectCountry: (countryName: string | null) => void;
  currentTheme: HomeTheme;
  isDarkMode: boolean;
}
