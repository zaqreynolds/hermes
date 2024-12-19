"use client";
import {
  FlightSearchContext,
  defaultSearchState,
} from "@/context/FlightSearchContext";
import { useContext } from "react";

const Pricing = () => {
  const { searchState } = useContext(FlightSearchContext);
  const selectedDeparture = searchState.selectedDeparture;
  const selectedReturn = searchState.selectedReturn;

  return (
    <div className="flex flex-col flex-1 w-full overflow-hidden">
      <h2 className="text-lg font-semibold mb-1">Price Analysis: </h2>
      <div className="flex w-full">
        <div>Departure:</div> <div>{selectedDeparture?.price.total}</div>
      </div>
      <div className="flex w-full">
        <div>Return:</div>
        <div>{selectedReturn?.price.total}</div>
      </div>
    </div>
  );
};
export default Pricing;
