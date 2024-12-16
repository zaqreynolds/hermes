"use client";
import { FlightSearchContext } from "@/context/FlightSearchContext";
import { FlightOffer } from "amadeus-ts";
import { useContext } from "react";

export const FlightSearchResults = () => {
  const { searchState } = useContext(FlightSearchContext);

  const departureOffers = searchState.departureOffers as FlightOffer[];
  console.log("departureOffers", departureOffers);

  return (
    <div>
      {departureOffers.map((flight) => (
        <div key={flight.id} className="flex">
          <h2>{flight.id}</h2>
          <h3>{flight.price.total}</h3>
        </div>
      ))}
      {departureOffers.length === 0 && <div>No results yet</div>}
    </div>
  );
};
