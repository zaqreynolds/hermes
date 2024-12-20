"use client";
import {
  FlightSearchContext,
  defaultSearchState,
} from "@/context/FlightSearchContext";
import { FlightOffer } from "amadeus-ts";
import { useContext } from "react";
import FlightResultCard from "./FlightResultCard";
import { useIsMobile } from "@/hooks/use-mobile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

type FlightDirection = "departure" | "return";

export const FlightSearchResults = ({ loading }: { loading: boolean }) => {
  const { searchState, handleSelectFlight } = useContext(FlightSearchContext);
  const selectedDeparture = searchState.selectedDeparture;
  const selectedReturn = searchState.selectedReturn;

  const isMobile = useIsMobile();

  const departureOffers = searchState.departureOffers as FlightOffer[];
  const returnOffers = searchState.returnOffers as FlightOffer[];

  const isDefaultState =
    JSON.stringify(searchState) === JSON.stringify(defaultSearchState);

  return (
    <div className="flex  w-[57.2%">
      {/* Flight Offers */}
      {!isDefaultState && (
        <div className="flex flex-col overflow-hidden">
          <h2 className="text-lg font-semibold mb-1">Select your flights:</h2>

          {!isDefaultState && !isMobile && (
            <div className="flex h-full overflow-hidden">
              {/* Departure Column */}
              <div className="flex flex-col pr-2">
                <div className="text-base mb-2 shrink-0">Departure</div>
                <div className="flex-1 overflow-auto">
                  {departureOffers.map((flight) => (
                    <FlightResultCard
                      key={flight.id}
                      flight={flight}
                      isSelected={selectedDeparture?.id === flight.id}
                      onSelect={() => handleSelectFlight(flight, "departure")}
                      view="search"
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
                <div className="text-base mb-2 shrink-0">Return</div>
                <div className="flex-1 overflow-auto">
                  {returnOffers.map((flight) => (
                    <FlightResultCard
                      key={flight.id}
                      flight={flight}
                      isSelected={selectedReturn?.id === flight.id}
                      onSelect={() => handleSelectFlight(flight, "return")}
                      view="search"
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
                  onSelect={() => handleSelectFlight(flight, "departure")}
                  view="search"
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
                  onSelect={() => handleSelectFlight(flight, "return")}
                  view="search"
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
