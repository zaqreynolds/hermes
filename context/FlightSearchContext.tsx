"use client";
import AmadeusHealthDialog from "@/app/_views/AmadeusHealthDialog";
import { FlightSearchState } from "@/app/types";

type FlightSearchContextType = {
  searchState: FlightSearchState;
  setSearchState: React.Dispatch<React.SetStateAction<FlightSearchState>>;
  amadeusStatus: "ok" | "unavailable" | "checking";
};
import { createContext, useState, ReactNode, useEffect } from "react";

export const defaultState: FlightSearchState = {
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
  amadeusStatus: "checking",
});

export const FlightSearchProvider = ({ children }: { children: ReactNode }) => {
  const [searchState, setSearchState] =
    useState<FlightSearchState>(defaultState);
  const [amadeusStatus, setAmadeusStatus] = useState<
    "ok" | "unavailable" | "checking"
  >("checking");

  useEffect(() => {
    const checkAmadeusStatus = async () => {
      try {
        const response = await fetch("/api/amadeus/health");
        if (response.ok) {
          setAmadeusStatus("ok");
        } else {
          setAmadeusStatus("unavailable");
        }
      } catch (error) {
        console.error("Error checking Amadeus API status:", error);
        setAmadeusStatus("unavailable");
      }
    };

    checkAmadeusStatus();
  }, []);

  return (
    <FlightSearchContext.Provider
      value={{ searchState, setSearchState, amadeusStatus }}
    >
      {children}
      <AmadeusHealthDialog open={amadeusStatus === "unavailable"} />
    </FlightSearchContext.Provider>
  );
};
