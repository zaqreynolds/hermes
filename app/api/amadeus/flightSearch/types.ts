export type Location = {
  cityCode: string;
  countryCode: string;
};

export type Carrier = string; // e.g., "United Airlines"
export type Aircraft = string; // e.g., "Boeing 737-900"

export type Dictionaries = {
  locations: Record<string, Location | undefined>; // Maps IATA codes to locations
  carriers: Record<string, Carrier>; // Maps carrier codes to airline names
  aircraft: Record<string, Aircraft>; // Maps aircraft codes to model names
  currencies: Record<string, string>; // Maps currency codes to currency names
};

export type Segment = {
  departure: {
    iataCode: string;
    at: string; // ISO date string
  };
  arrival: {
    iataCode: string;
    at: string; // ISO date string
  };
  carrierCode: string;
  number: string; // Flight number
  aircraft: {
    code: string;
  };
  duration: string; // ISO 8601 duration string, e.g., "PT2H59M"
};

export type Itinerary = {
  duration: string; // ISO 8601 duration string
  segments: Segment[];
};

export type TravelerPricing = {
  travelerId: string;
  fareOption: string;
  travelerType: string; // e.g., "ADULT", "CHILD"
  price: {
    currency: string;
    total: string;
    base: string;
  };
  fareDetailsBySegment: {
    segmentId: string;
    cabin: string;
    brandedFare: string;
    class: string;
    includedCheckedBags: {
      quantity: number;
    };
  }[];
};

export type FlightOffer = {
  id: string;
  price: {
    currency: string;
    total: string;
    base: string;
  };
  itineraries: Itinerary[];
  travelerPricings: TravelerPricing[];
  validatingAirlineCodes: string[]; // Carrier codes
};

export type FlightOffersResponse = {
  meta: {
    count: number;
    links: {
      self: string;
    };
  };
  data: FlightOffer[];
  dictionaries: Dictionaries;
};
