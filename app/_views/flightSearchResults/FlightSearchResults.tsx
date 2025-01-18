"use client";
import {
  FlightSearchContext,
  defaultSearchState,
} from "@/context/FlightSearchContext";
import { FlightOffer } from "amadeus-ts";
import { useContext, useState } from "react";
import FlightResultCard from "./FlightResultCard";
import { useIsMobile } from "@/hooks/use-mobile";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { FilterIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MobileFilterToolbar } from "./toolbar/MobileFilterToolbar";

export const FlightSearchResults = () => {
  const {
    searchState,
    handleSelectFlight,
    isFlightSearchLoading,
    selectedAirlines,
  } = useContext(FlightSearchContext);
  const [isOpen, setIsOpen] = useState(false);

  const flightOffers = searchState.flightOffers as FlightOffer[];
  const selectedFlight = searchState.selectedFlight;
  const isMobile = useIsMobile();

  const isDefaultState =
    JSON.stringify(searchState) === JSON.stringify(defaultSearchState);

  const filteredFlightOffers = selectedAirlines.length
    ? flightOffers.filter(
        (flight) =>
          flight.validatingAirlineCodes &&
          selectedAirlines.includes(flight.validatingAirlineCodes[0])
      )
    : flightOffers;

  const showSkeletons = isFlightSearchLoading && !filteredFlightOffers.length;

  return (
    <>
      {!isDefaultState && (
        <div
          className={cn("flex flex-col overflow-hidden", !isMobile && "mr-4")}
        >
          <div className="flex justify-items-center mb-4">
            <h2 className="text-lg font-semibold  mr-auto">
              Select your flight:
            </h2>

            {isMobile && (
              <>
                <Button variant="ghost" onClick={() => setIsOpen(!isOpen)}>
                  <FilterIcon className="w-6 h-6" />
                </Button>
              </>
            )}
          </div>
          {isOpen && <MobileFilterToolbar />}

          <div className="flex flex-col gap-1 overflow-y-auto overflow-x-hidden">
            {filteredFlightOffers.map((flight) => (
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
            {showSkeletons && <SkeletonFlightResultCards />}
          </div>
        </div>
      )}
    </>
  );
};

const SkeletonFlightResultCards = () => (
  <>
    {[...Array(4)].map((_, i) => (
      <Skeleton
        key={i}
        className="rounded-lg h-[206px] w-[384px] mb-1 flex-shrink-0"
      />
    ))}
  </>
);
