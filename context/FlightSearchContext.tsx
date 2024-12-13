"use client";
import { FlightSearchState } from "@/app/types";

type FlightSearchContextType = {
  searchState: FlightSearchState;
  setSearchState: React.Dispatch<React.SetStateAction<FlightSearchState>>;
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

export const FlightSearchContext = createContext<FlightSearchContextType>({
  searchState: defaultState,
  setSearchState: () => {},
});

export const FlightSearchProvider = ({ children }: { children: ReactNode }) => {
  const [searchState, setSearchState] =
    useState<FlightSearchState>(defaultState);

  return (
    <FlightSearchContext.Provider value={{ searchState, setSearchState }}>
      {children}
    </FlightSearchContext.Provider>
  );
};
