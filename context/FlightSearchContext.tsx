"use client";
import AmadeusHealthDialog from "@/app/_views/AmadeusHealthDialog";
import { FlightSearchState } from "@/app/types";
import { FlightOffer } from "amadeus-ts";

type FlightSearchContextType = {
  searchState: FlightSearchState;
  setSearchState: React.Dispatch<React.SetStateAction<FlightSearchState>>;
  amadeusStatus: "ok" | "unavailable" | "checking";
  handleSelectFlight: (
    flight: FlightOffer,
    direction: "departure" | "return"
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
  departureOffers: [],
  returnOffers: [],
  selectedDeparture: null,
  selectedReturn: null,
  pricedFlight: null,
  priceAnalysis: null,
};

export const FlightSearchContext = createContext<FlightSearchContextType>({
  searchState: defaultSearchState,
  setSearchState: () => {},
  amadeusStatus: "checking",
  handleSelectFlight: () => {},
});

export const FlightSearchProvider = ({ children }: { children: ReactNode }) => {
  const [searchState, setSearchState] =
    useState<FlightSearchState>(defaultSearchState);
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

  const handleSelectFlight = (
    flight: FlightOffer,
    direction: "departure" | "return"
  ) => {
    setSearchState((prev) => ({
      ...prev,
      [direction === "departure" ? "selectedDeparture" : "selectedReturn"]:
        prev[direction === "departure" ? "selectedDeparture" : "selectedReturn"]
          ?.id === flight.id
          ? null
          : flight,
    }));
  };

  return (
    <FlightSearchContext.Provider
      value={{ searchState, setSearchState, amadeusStatus, handleSelectFlight }}
    >
      {children}
      <AmadeusHealthDialog open={amadeusStatus === "unavailable"} />
    </FlightSearchContext.Provider>
  );
};
