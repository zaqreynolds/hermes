"use client";
import {
  FlightSearchContext,
  defaultState,
} from "@/context/FlightSearchContext";
import { cn } from "@/lib/utils";
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
    <div className="flex flex-col w-full max-w-[1155px]">
      {isDefaultState && (
        <div className="flex flex-col items-center">
          <h2 className="text-lg font-semibold mb-4">
            Search for flights above first...
          </h2>
        </div>
      )}
      {!isDefaultState && (
        <h2 className="text-lg font-semibold mb-4">Available Flights:</h2>
      )}
      {!isDefaultState && !isMobile && (
        <div className={cn("flex", isMobile && "flex-col")}>
          <div className="flex-col">
            <h3 className="text-lg mb-4">Departure</h3>
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
          <div className="flex-col pl-2">
            <h3 className="text-lg mb-4">Return</h3>
            {returnOffers.map((flight) => (
              <FlightResultCard
                key={flight.id}
                flight={flight}
                isSelected={selectedReturn?.id === flight.id}
                onSelect={() => handleSelectFlight(flight, "return")}
              />
            ))}
            {returnOffers.length === 0 && !loading && <div>No results yet</div>}
            {loading && <SkeletonFlightResultCards />}
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
      <Skeleton className="rounded-lg h-[181px] w-[460px] mb-1" />
      <Skeleton className="rounded-lg h-[181px] w-[460px] mb-1" />
      <Skeleton className="rounded-lg h-[181px] w-[460px] mb-1" />
      <Skeleton className="rounded-lg h-[181px] w-[460px] mb-1" />
    </>
  );
};
