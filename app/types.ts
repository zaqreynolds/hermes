import { FlightOffer } from "amadeus-ts";

export interface Address {
  cityName: string;
  cityCode: string;
  countryName: string;
  countryCode: string;
  regionCode?: string;
  stateCode?: string;
}

export interface Analytics {
  travelers: {
    score: number;
  };
}

export interface GeoCode {
  latitude: number;
  longitude: number;
}

export interface Self {
  href: string;
  methods: string[];
}

export interface AmadeusLocation {
  address: Address;
  analytics: Analytics;
  detailedName: string;
  geoCode: GeoCode;
  iataCode: string;
  id: string;
  name: string;
  self?: Self;
  subType?: string;
  timeZoneOffset?: string;
  type?: string;
}

export type TravelDirection = "origin" | "destination";

export interface Travelers {
  adults: number;
  children: number;
  infants: number;
}

export interface TravelerCategory {
  label: string;
  type: keyof Travelers;
  description?: string;
  max: number;
  min: number;
  validateAdd: (current: Travelers) => boolean;
}

//for Context
export interface FlightSearchState {
  isOneWay: boolean;
  origin: string | null;
  destination: string | null;
  departureDate: Date | null;
  returnDate: Date | null;

  travelers: {
    adults: number;
    children: number;
    infants: number;
  };

  travelClass: "ECONOMY" | "BUSINESS" | "FIRST" | "PREMIUM_ECONOMY";
  nonStop: boolean;

  // Decoded offers for display
  departureOffers: FlightOffer[];
  returnOffers: FlightOffer[];

  // Raw offers for API calls
  rawDepartureOffers: FlightOffer[];
  rawReturnOffers: FlightOffer[];

  selectedDeparture: FlightOffer | null;
  selectedReturn: FlightOffer | null;

  pricedFlight: FlightOffer | null;
  priceAnalysis: PriceAnalysis | null;
}

export interface PriceAnalysis {
  average: number;
  lowest: number;
  highest: number;
  numberOfPrices: number;
  priceBucket: "LOW" | "MEDIUM" | "HIGH";
}
