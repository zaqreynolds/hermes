import { FlightSearchState } from "@/app/types";

type FlightSearchContextType = {
  state: FlightSearchState;
  setState: React.Dispatch<React.SetStateAction<FlightSearchState>>;
};
import { createContext, useState, ReactNode } from "react";

const defaultState: FlightSearchState = {
  // User inputs
  isOneWay: false,
  origin: null,
  destination: null,
  departureDate: null,
  returnDate: null,

  // Traveler details
  travelers: {
    adults: 1, // Default to 1 adult
    children: 0,
    infants: 0,
  },

  // Preferences
  travelClass: "ECONOMY",
  nonStop: false,

  // API results
  flightOffers: [],
  pricedFlight: null,
  priceAnalysis: null,
};

const FlightSearchContext = createContext<FlightSearchContextType>({
  state: defaultState,
  setState: () => {},
});

export const FlightSearchProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<FlightSearchState>(defaultState);

  return (
    <FlightSearchContext.Provider value={{ state, setState }}>
      {children}
    </FlightSearchContext.Provider>
  );
};
