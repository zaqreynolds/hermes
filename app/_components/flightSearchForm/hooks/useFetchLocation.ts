"use client";
import { useState, useCallback } from "react";
import { AmadeusLocation } from "../../../types";

export const useFetchLocation = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [locationData, setLocationData] = useState<AmadeusLocation[]>([]);

  const fetchLocation = useCallback(async (keyword: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `/api/amadeus/locations?keyword=${encodeURIComponent(keyword)}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch locations");
      }
      const result: AmadeusLocation[] = await response.json();
      setLocationData(result);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError(String(error));
      }
      console.error("Error fetching locations", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearLocationData = () => {
    setLocationData([]);
  };

  return { isLoading, error, locationData, fetchLocation, clearLocationData };
};
