"use client";
import {
  FlightSearchContext,
  defaultSearchState,
} from "@/context/FlightSearchContext";
import { useContext } from "react";
import FlightResultCard from "../flightSearchResults/FlightResultCard";
import { FlightOffer } from "amadeus-ts";
import { Button } from "@/components/ui/button";

const Pricing = () => {
  const { searchState } = useContext(FlightSearchContext);
  const selectedDeparture = searchState.selectedDeparture;
  const selectedReturn = searchState.selectedReturn;

  const isDefaultState =
    JSON.stringify(searchState) === JSON.stringify(defaultSearchState);

  return (
    <div className="flex flex-col flex-1 w-full overflow-hidden ">
      {!isDefaultState && (
        <>
          <h2 className="text-lg font-semibold mb-1">Price Analysis: </h2>
          {!selectedDeparture && !selectedReturn && (
            <div>Select flights to continue..</div>
          )}
          {selectedDeparture && (
            <div className="flex w-full">
              <div className="w-24">Departure:</div>

              <FlightResultCard
                flight={selectedDeparture as FlightOffer}
                view="details"
              />
            </div>
          )}
          {selectedReturn && (
            <div className="flex w-full">
              <div className="w-24">Return:</div>

              <FlightResultCard
                flight={selectedReturn as FlightOffer}
                view="details"
              />
            </div>
          )}
          <div className="flex w-full justify-end mt-4">
            <Button className="w-fit">Check Price & Analysis</Button>
          </div>
        </>
      )}
    </div>
  );
};
export default Pricing;
