export interface ExploreDestination {
  id: string;
  title: string;
  name: string;
  location: string;
  city?: string;
  state?: string | null;
  country: string;
  category: string;
  categories: string[];
  coverImageUrl?: string | null;
  photoQuery?: string | null;
  image_url?: string | null;
  avgColor?: string | null;
  alt?: string | null;
  realRating: string;
  rating: number;
  reviewCount: number;
  price?: number | null;
  priceRange?: string | null;
  aiCostEstimates?: string | null;
}

export interface ExploreQueryParams {
  category?: string;
  name?: string;
  sortBy?: string;
  page?: number;
  size?: number;
}

export interface CategoryThemeConfig {
  colors: string[];
  accent: string;
}
