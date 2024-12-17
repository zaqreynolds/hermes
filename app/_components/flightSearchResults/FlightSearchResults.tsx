"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { FlightSearchContext } from "@/context/FlightSearchContext";
import { durationFormat } from "@/lib/utils";
import { FlightOffer } from "amadeus-ts";
import { useContext } from "react";
import FlightResultCard from "./FlightResultCard";

export const FlightSearchResults = () => {
  const { searchState } = useContext(FlightSearchContext);

  const departureOffers = searchState.departureOffers as FlightOffer[];
  const returnOffers = searchState.returnOffers as FlightOffer[];

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Available Flights:</h2>
      <div className="flex">
        <div className="flex-1 flex-col">
          <h3 className="text-lg font-semibold mb-4">Departure:</h3>
          {departureOffers.map((flight) => (
            <FlightResultCard key={flight.id} flight={flight} />
          ))}
          {departureOffers.length === 0 && <div>No results yet</div>}
        </div>
        <div className="flex-1 flex-col">
          <h3 className="text-lg font-semibold mb-4">Return:</h3>
          {returnOffers.map((flight) => (
            <FlightResultCard key={flight.id} flight={flight} />
          ))}
          {returnOffers.length === 0 && <div>No results yet</div>}
        </div>
      </div>
    </div>
  );
};
