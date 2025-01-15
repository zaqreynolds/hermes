"use client";
import AmadeusHealthDialog from "@/app/_views/AmadeusHealthDialog";
import { FlightSearchState } from "@/app/types";
import { FlightOffer } from "amadeus-ts";

type FlightSearchContextType = {
  searchState: FlightSearchState;
  isFlightSearchLoading: boolean;
  setIsFlightSearchLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setSearchState: React.Dispatch<React.SetStateAction<FlightSearchState>>;
  amadeusStatus: "ok" | "unavailable" | "checking";
  handleSelectFlight: (flight: FlightOffer) => void;
  updateOffers: (
    rawFlightOffers: FlightOffer[],
    flightOffers: FlightOffer[]
  ) => void;
};
import { createContext, useState, ReactNode, useEffect } from "react";

export const defaultSearchState: FlightSearchState = {
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
  flightOffers: [],
  rawFlightOffers: [],
  selectedFlight: null,
  pricedFlight: null,
  priceAnalysis: null,
};

export const FlightSearchContext = createContext<FlightSearchContextType>({
  searchState: defaultSearchState,
  isFlightSearchLoading: false,
  setIsFlightSearchLoading: () => {},
  setSearchState: () => {},
  amadeusStatus: "checking",
  handleSelectFlight: () => {},
  updateOffers: () => {},
});

export const FlightSearchProvider = ({ children }: { children: ReactNode }) => {
  const [searchState, setSearchState] =
    useState<FlightSearchState>(defaultSearchState);
  const [isFlightSearchLoading, setIsFlightSearchLoading] =
    useState<boolean>(false);
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

  const handleSelectFlight = (flight: FlightOffer) => {
    setSearchState((prev) => ({
      ...prev,
      selectedFlight: prev.selectedFlight?.id === flight.id ? null : flight,
    }));
  };

  const updateOffers = (
    rawFlightOffers: FlightOffer[],
    flightOffers: FlightOffer[]
  ) => {
    setSearchState((prev) => ({
      ...prev,
      rawFlightOffers,
      flightOffers,
    }));
  };

  return (
    <FlightSearchContext.Provider
      value={{
        searchState,
        setSearchState,
        updateOffers,
        isFlightSearchLoading,
        setIsFlightSearchLoading,
        amadeusStatus,
        handleSelectFlight,
      }}
    >
      {children}
      <AmadeusHealthDialog open={amadeusStatus === "unavailable"} />
    </FlightSearchContext.Provider>
  );
};
