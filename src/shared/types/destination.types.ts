export interface DestinationWeatherResponse {
  destinationId: string;
  temperature: number;
  windSpeed: number;
  rainProbability: number;
  conditionText: string;
  updatedAt: string;
}

export interface WeatherData {
  temp: number;
  humidity: number;
  rainProbability: number;
  wind: number;
  condition: string;
  updatedAt?: string;
}

export interface DestinationImageResponse {
  id: string;
  url: string;
  photographer: string;
  photographerUrl: string;
  isCover: boolean;
  position: number;
  pexelsId?: number | null;
  alt?: string | null;
  width?: number | null;
  height?: number | null;
  avgColor?: string | null;
}

export interface AirportResponse {
  id: string;
  iataCode: string;
  icaoCode: string;
  name: string;
  city: string;
  state: string;
  country: string;
  continent: string;
  type: string;
  keywords?: string | null;
  homeLink?: string | null;
  wikipediaLink?: string | null;
  latitude: number;
  longitude: number;
}

export interface CommentPhotoResponse {
  id: string;
  url: string;
  orderIndex: number;
}

export interface CommentResponse {
  id: string;
  userId: string;
  destinationId: string;
  rating: number;
  content: string;
  createdAt: string;
  updatedAt?: string | null;
  userName?: string | null;
  userAvatarUrl?: string | null;
  helpfulCount: number;
  isHelpful: boolean;
  photos: CommentPhotoResponse[];
}

export interface DestinationCommentsSummary {
  destinationId: string;
  averageRating: number;
  totalComments: number;
  comments: CommentResponse[];
}

export interface CostRange {
  min: number;
  max: number;
}

export interface DailyTotalCost {
  min: number;
  max: number;
}

export interface AiCostEstimates {
  daily_total?: DailyTotalCost;
  accommodation?: CostRange;
  food?: CostRange;
  transport?: CostRange;
  activities?: CostRange;
}

export interface DestinationDetailResponse {
  id: string;
  name: string;
  city: string;
  state?: string | null;
  country: string;
  iata?: string | null;
  nearestAirportIata?: string | null;
  coverImageUrl?: string | null;
  photoQuery?: string | null;
  rating: number;
  reviewCount: number;
  description: string[];
  aiCostEstimates?: string | null;
  approximatePopulation?: number | null;
  popularity?: number | null;
  nearestAirport?: AirportResponse | null;
  images: DestinationImageResponse[];
  weather?: DestinationWeatherResponse | null;
  comments?: DestinationCommentsSummary | null;
}

export interface NormalizedDestination {
  id: string;
  title: string;
  name: string;
  location: string;
  city: string;
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
  aiCostEstimates?: string | AiCostEstimates | null;
  description?: string[];
  aiSummary?: string[];
  images?: DestinationImageResponse[];
  weather?: DestinationWeatherResponse | null;
}
