export interface FavoriteDestination {
  id: string;
  destinationId: string;
  item_id: string;
  title: string;
  name: string;
  location: string;
  category: string;
  categories: string[];
  coverImageUrl?: string | null;
  image_url?: string | null;
  rating: number;
  reviewCount: number;
  realRating: string;
  createdAt?: string;
  destinationRating?: number;
  destinationReviewCount?: number;
}

export interface FavoriteCardDimensions {
  cardWidth: number;
  cardHeight: number;
  isSmallScreen: boolean;
  targetRows: number;
  tabBarHeight: number;
  verticalPadding: number;
  scrollPaddingBottom: number;
}

export interface FavoriteQueryParams {
  page?: number;
  size?: number;
  search?: string;
}
