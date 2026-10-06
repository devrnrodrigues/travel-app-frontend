export interface Airport {
  id: string;
  iataCode: string;
  name: string;
  city: string;
  state: string;
  country: string;
  codigo_iata?: string;
  nome_aeroporto?: string;
  cidade?: string;
  estado?: string;
}

export interface FlightLeg {
  label?: string | null;
  departureTime?: string | null;
  arrivalTime?: string | null;
  duration?: string | null;
  originAirport?: string | null;
  destinationAirport?: string | null;
  departureDate?: string | null;
}

export interface FlightTicket {
  id: string;
  company: string;
  logo: string | null;
  stops: string;
  isDirect: boolean;
  departureTime: string | null;
  arrivalTime: string | null;
  duration: string | null;
  hasReturn: boolean;
  returnDepartureTime: string | null;
  returnArrivalTime: string | null;
  returnDuration: string | null;
  returnStops: string | null;
  baggageInfo: string | null;
  cabinBagInfo: string | null;
  price: string | null;
  priceNum: number;
  currency: string;
  bookingUrl: string | null;
}

export type TripType = "ROUND_TRIP" | "ONE_WAY";

export type CabinClassType = "ECONOMY" | "PREMIUM_ECONOMY" | "BUSINESS" | "FIRST";

export type SortType = "CHEAPEST" | "BEST" | "FASTEST";

export type CurrencyType = "BRL" | "USD" | "EUR" | "GBP" | "AED";

export interface FlightSearchParams {
  fromIata: string;
  toIata: string;
  departDate: string;
  returnDate?: string | null;
  adults?: string | number;
  children?: string | string[];
  cabinClass?: string;
  currency?: string;
  sort?: string;
  onlyDirect?: boolean;
}

export interface FormErrors {
  origin?: string | null;
  destination?: string | null;
  departDate?: string | null;
  returnDate?: string | null;
  adults?: string | null;
  children?: string | null;
}
