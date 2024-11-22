export interface Address {
  cityName: string;
  cityCode: string;
  countryName: string;
  countryCode: string;
  stateCode: string;
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
  self: Self;
  subType: string;
  timeZoneOffset: string;
  type: string;
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
