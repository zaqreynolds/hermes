"use client";
import { FlightSearchContext } from "@/context/FlightSearchContext";
import { FlightOffer } from "amadeus-ts";
import { useContext } from "react";

export const FlightSearchResults = () => {
  const { searchState } = useContext(FlightSearchContext);

  const flightResults = searchState.departureOffers as FlightOffer[];
  return (
    <div>
      {flightResults.map((flight) => (
        <div key={flight.id}>
          <h2>{flight.id}</h2>
          <h3>{flight.price.total}</h3>
        </div>
      ))}
      {flightResults.length === 0 && <div>No results yet</div>}
    </div>
  );
};
