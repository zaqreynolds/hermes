"use client";

import { PriceAnalysis } from "@/app/types";
import { FlightOffer } from "amadeus-ts";
import { useState } from "react";

interface FetchFlightDataParams {
  flightOffer: FlightOffer;
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
}

export interface FlightPricingResponse {
  flightOffersPrice: FlightOffer;
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
      const formattedParams = {
        ...params,
        departureDate: params.departureDate.split("T")[0], // Strip time
        returnDate: params.returnDate?.split("T")[0], // Optional: strip time if returnDate exists
      };

      console.log("Data being sent to price analysis API:", formattedParams);
      const response = await fetch("/api/amadeus/price", {
        method: "POST",
        body: JSON.stringify(formattedParams),
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
