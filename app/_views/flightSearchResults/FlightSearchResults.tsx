"use client";
import {
  FlightSearchContext,
  defaultSearchState,
} from "@/context/FlightSearchContext";
import { FlightOffer } from "amadeus-ts";
import { useContext } from "react";
import FlightResultCard from "./FlightResultCard";
// import { useIsMobile } from "@/hooks/use-mobile";

import { Skeleton } from "@/components/ui/skeleton";

export const FlightSearchResults = () => {
  const { searchState, handleSelectFlight, isFlightSearchLoading } =
    useContext(FlightSearchContext);

  const flightOffers = searchState.flightOffers as FlightOffer[];
  const selectedFlight = searchState.selectedFlight;
  // const isMobile = useIsMobile();

  const isDefaultState =
    JSON.stringify(searchState) === JSON.stringify(defaultSearchState);

  return (
    <div className="flex flex-col">
      {!isDefaultState && (
        <div className="flex flex-col overflow-hidden">
          <h2 className="text-lg font-semibold mb-4">Select your flight:</h2>
          <div className="flex flex-col gap-4 overflow-auto">
            {flightOffers.map((flight) => (
              <FlightResultCard
                key={flight.id}
                flight={flight}
                isSelected={selectedFlight?.id === flight.id}
                onSelect={() => handleSelectFlight(flight)}
                view="search"
              />
            ))}
            {flightOffers.length === 0 && !isFlightSearchLoading && (
              <div>No results yet</div>
            )}
            {isFlightSearchLoading && <SkeletonFlightResultCards />}
          </div>
        </div>
      )}
    </div>
  );
};

const SkeletonFlightResultCards = () => (
  <>
    {[...Array(4)].map((_, i) => (
      <Skeleton key={i} className="rounded-lg h-[117px] w-[313px] mb-1" />
    ))}
  </>
);
