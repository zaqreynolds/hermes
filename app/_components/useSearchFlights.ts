"use client";
import { useState, useCallback } from "react";
import { flightSearchSchema } from "./flightSearchSchema";
import { z } from "zod";

export const useSearchFlights = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<z.infer<typeof flightSearchSchema> | null>(
    null
  );

  const preprocessedData = (formData: z.infer<typeof flightSearchSchema>) => ({
    ...formData,
    departureDate: formData.departureDate.toISOString().split("T")[0],
    returnDate: formData.returnDate
      ? formData.returnDate.toISOString().split("T")[0]
      : undefined,
  });

  const searchFlights = useCallback(
    async (formData: z.infer<typeof flightSearchSchema>) => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/amadeus/flightSearch", {
          method: "POST",
          body: JSON.stringify(preprocessedData(formData)),
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Failed to search flights");
        }
        const result = await response.json();
        setData(result);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError(String(error));
        }
        console.error("Error searching flights", error);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { loading, error, data, searchFlights };
};
