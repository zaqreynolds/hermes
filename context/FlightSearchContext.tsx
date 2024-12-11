import { FlightSearchState } from "@/app/types";

type FlightSearchContextType = {
  state: FlightSearchState;
  setState: React.Dispatch<React.SetStateAction<FlightSearchState>>;
};
import { createContext, useState, ReactNode } from "react";

const defaultState: FlightSearchState = {
  isOneWay: false,
  origin: null,
  destination: null,
  departureDate: null,
  returnDate: null,
  travelers: {
    adults: 1,
    children: 0,
    infants: 0,
  },
  travelClass: "ECONOMY",
  nonStop: false,
  departureOffers: [],
  returnOffers: [],
  selectedDeparture: null,
  selectedReturn: null,
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
