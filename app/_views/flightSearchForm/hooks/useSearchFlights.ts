"use client";
import { useState, useCallback, useContext } from "react";
import { FlightOffer } from "amadeus-ts";
import { FlightSearchContext } from "@/context/FlightSearchContext";

export type SearchFlightsInput = {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  travelers: {
    adults: number;
    children: number;
    infants: number;
  };
  travelClass?: string;
  nonStop: boolean;
};

export type FlightSearchResult = {
  rawDepartureOffers: FlightOffer[];
  rawReturnOffers?: FlightOffer[];
  decodedDepartureOffers: FlightOffer[];
  decodedReturnOffers?: FlightOffer[];
};

export const useSearchFlights = () => {
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<FlightSearchResult | null>(null);

  const { setIsFlightSearchLoading, updateOffers } =
    useContext(FlightSearchContext);

  const preprocessedData = (data: SearchFlightsInput) => ({
    ...data,
    departureDate: new Date(data.departureDate),
    returnDate: data.returnDate ? new Date(data.returnDate) : undefined,
  });
  const searchFlights = useCallback(async (data: SearchFlightsInput) => {
    setIsFlightSearchLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/amadeus/flightSearch", {
        method: "POST",
        body: JSON.stringify(preprocessedData(data)),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to search flights");
      }
      const result: FlightSearchResult = await response.json();

      console.log("Raw Flight Offers:", result);

      updateOffers(
        result.rawDepartureOffers,
        result.rawReturnOffers || [],
        result.decodedDepartureOffers,
        result.decodedReturnOffers || []
      );

      setData(result);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError(String(error));
      }
      console.error("Error searching flights", error);
    } finally {
      setIsFlightSearchLoading(false);
    }
  }, []);

  return { error, data, searchFlights };
};
