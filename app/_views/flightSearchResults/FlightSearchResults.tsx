"use client";
import {
  FlightSearchContext,
  defaultState,
} from "@/context/FlightSearchContext";
import { FlightOffer } from "amadeus-ts";
import { useContext, useState } from "react";
import FlightResultCard from "./FlightResultCard";
import { useIsMobile } from "@/hooks/use-mobile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

type FlightDirection = "departure" | "return";

export const FlightSearchResults = ({ loading }: { loading: boolean }) => {
  const [selectedDeparture, setSelectedDeparture] =
    useState<FlightOffer | null>(null);
  const [selectedReturn, setSelectedReturn] = useState<FlightOffer | null>(
    null
  );

  const { searchState } = useContext(FlightSearchContext);
  const isMobile = useIsMobile();

  const departureOffers = searchState.departureOffers as FlightOffer[];
  const returnOffers = searchState.returnOffers as FlightOffer[];

  const isDefaultState =
    JSON.stringify(searchState) === JSON.stringify(defaultState);

  const handleSelectFlight = (
    flight: FlightOffer,
    direction: FlightDirection
  ) => {
    if (direction === "departure") {
      if (selectedDeparture?.id === flight.id) {
        setSelectedDeparture(null);
        return;
      }
      setSelectedDeparture(flight);
    } else {
      if (selectedReturn?.id === flight.id) {
        setSelectedReturn(null);
        return;
      }
      setSelectedReturn(flight);
    }
  };

  return (
    <div className="flex flex-col w-full overflow-hidden">
      {!isDefaultState && (
        <h2 className="text-lg font-semibold mb-1">Select your flights:</h2>
      )}
      {!isDefaultState && !isMobile && (
        <div className="flex h-full overflow-hidden">
          {/* Departure Column */}
          <div className="flex flex-col pr-2">
            <h3 className="text-lg mb-2 shrink-0">Departure</h3>
            <div className="flex-1 overflow-auto">
              {departureOffers.map((flight) => (
                <FlightResultCard
                  key={flight.id}
                  flight={flight}
                  isSelected={selectedDeparture?.id === flight.id}
                  onSelect={() => handleSelectFlight(flight, "departure")}
                />
              ))}
              {departureOffers.length === 0 && !loading && (
                <div>No results yet</div>
              )}
              {loading && <SkeletonFlightResultCards />}
            </div>
          </div>

          {/* Return Column */}
          <div className="flex flex-col px-2">
            <h3 className="text-lg mb-2 shrink-0">Return</h3>
            <div className="flex-1 overflow-auto">
              {returnOffers.map((flight) => (
                <FlightResultCard
                  key={flight.id}
                  flight={flight}
                  isSelected={selectedReturn?.id === flight.id}
                  onSelect={() => handleSelectFlight(flight, "return")}
                />
              ))}
              {returnOffers.length === 0 && !loading && (
                <div>No results yet</div>
              )}
              {loading && <SkeletonFlightResultCards />}
            </div>
          </div>
        </div>
      )}
      {!isDefaultState && isMobile && (
        <Tabs className="flex flex-col items-center">
          <TabsList defaultValue="departure" className="w-fit shadow-md">
            <TabsTrigger value="departure" className="text-lg">
              Departure
            </TabsTrigger>
            <TabsTrigger value="return" className="text-lg">
              Return
            </TabsTrigger>
          </TabsList>
          <TabsContent value="departure">
            <div className="flex-1 flex-col">
              {departureOffers.map((flight) => (
                <FlightResultCard
                  key={flight.id}
                  flight={flight}
                  isSelected={selectedDeparture?.id === flight.id}
                  onSelect={() => setSelectedDeparture(flight)}
                />
              ))}
              {departureOffers.length === 0 && <div>No results yet</div>}
            </div>
          </TabsContent>
          <TabsContent value="return">
            <div className="flex-1 flex-col ">
              {returnOffers.map((flight) => (
                <FlightResultCard
                  key={flight.id}
                  flight={flight}
                  isSelected={selectedReturn?.id === flight.id}
                  onSelect={() => setSelectedReturn(flight)}
                />
              ))}
              {returnOffers.length === 0 && <div>No results yet</div>}
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

const SkeletonFlightResultCards = () => {
  return (
    <>
      <Skeleton className="rounded-lg h-[181px] w-[313px] mb-1" />
      <Skeleton className="rounded-lg h-[181px] w-[313px] mb-1" />
      <Skeleton className="rounded-lg h-[181px] w-[313px] mb-1" />
      <Skeleton className="rounded-lg h-[181px] w-[313px] mb-1" />
    </>
  );
};
