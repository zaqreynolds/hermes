"use client";
import { FlightSearchContext } from "@/context/FlightSearchContext";
import { cn } from "@/lib/utils";
import { FlightOffer } from "amadeus-ts";
import { useContext } from "react";
import FlightResultCard from "./FlightResultCard";
import { useIsMobile } from "@/hooks/use-mobile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSearchFlights } from "../flightSearchForm/hooks/useSearchFlights";
import { Skeleton } from "@/components/ui/skeleton";

export const FlightSearchResults = () => {
  const { searchState } = useContext(FlightSearchContext);
  const isMobile = useIsMobile();
  const { loading } = useSearchFlights();

  const departureOffers = searchState.departureOffers as FlightOffer[];
  const returnOffers = searchState.returnOffers as FlightOffer[];

  return (
    <div className="flex flex-col">
      <h2 className="text-lg font-semibold mb-4">Available Flights:</h2>
      {!isMobile && (
        <div className={cn("flex", isMobile && "flex-col")}>
          <div className="flex-1 flex-col">
            <h3 className="text-lg mb-4">Departure</h3>
            {departureOffers.map((flight) => (
              <FlightResultCard key={flight.id} flight={flight} />
            ))}
            {departureOffers.length === 0 && !loading && (
              <div>No results yet</div>
            )}
            {loading && <SkeletonFlightResultCards />}
          </div>
          <div className="flex-1 flex-col pl-2">
            <h3 className="text-lg mb-4">Return</h3>
            {returnOffers.map((flight) => (
              <FlightResultCard key={flight.id} flight={flight} />
            ))}
            {returnOffers.length === 0 && !loading && <div>No results yet</div>}
            {loading && <SkeletonFlightResultCards />}
          </div>
        </div>
      )}
      {isMobile && (
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
                <FlightResultCard key={flight.id} flight={flight} />
              ))}
              {departureOffers.length === 0 && <div>No results yet</div>}
            </div>
          </TabsContent>
          <TabsContent value="return">
            <div className="flex-1 flex-col ">
              {returnOffers.map((flight) => (
                <FlightResultCard key={flight.id} flight={flight} />
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
      <Skeleton className="rounded-lg h-[181px] w-[571px] mb-1" />
      <Skeleton className="rounded-lg h-[181px] w-[571px] mb-1" />
      <Skeleton className="rounded-lg h-[181px] w-[571px] mb-1" />
    </>
  );
};
