"use client";

import { PriceAnalysis } from "@/app/types";
import { FlightOffer } from "amadeus-ts";
import { useState } from "react";

interface FetchFlightDataParams {
  flightOffers: FlightOffer[];
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
}

interface FlightPricingResponse {
  flightOffersPrice: FlightOffer[];
  flightPriceAnalysis: PriceAnalysis;
}

const useSearchPriceAnalysis = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<FlightPricingResponse | null>(null);

  const fetchPriceAnalysis = async (params: FetchFlightDataParams) => {
    setLoading(true);
    setError(null);
    try {
      console.log("Data being sent to price analysis API:", params);
      const response = await fetch("api/amadeus/price", {
        method: "POST",
        body: JSON.stringify(params),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch price analysis");
      }
      const result = await response.json();
      console.log("Price analysis result:", result);
      setData(result);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError(String(error));
      }
      console.error("Error fetching price analysis", error);
    }
    setLoading(false);
  };
  return { loading, error, data, fetchPriceAnalysis };
};

export default useSearchPriceAnalysis;
