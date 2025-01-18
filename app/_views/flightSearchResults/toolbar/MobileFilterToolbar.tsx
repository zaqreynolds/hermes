"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { FlightSearchContext } from "@/context/FlightSearchContext";
import { useContext } from "react";

export const MobileFilterToolbar = () => {
  const { airlines, selectedAirlines, setSelectedAirlines, searchState } =
    useContext(FlightSearchContext);

  const flightOffers = searchState.flightOffers;

  const airlineCounts = airlines.reduce((counts, airline) => {
    const count = flightOffers.filter(
      (flight) =>
        flight.validatingAirlineCodes &&
        flight.validatingAirlineCodes[0] === airline
    ).length;
    counts[airline] = count;
    return counts;
  }, {} as Record<string, number>);

  return (
    <div className="flex flex-col">
      {airlines.length > 0 && <p className="font-bold mb-1">Airlines</p>}
      {airlines.map((airline) => (
        <div key={airline} className="flex items-center mb-1">
          <Checkbox
            className="mr-2"
            id={airline}
            checked={selectedAirlines.includes(airline)}
            onCheckedChange={(e) => {
              if (e) {
                setSelectedAirlines([...selectedAirlines, airline]);
              } else {
                setSelectedAirlines(
                  selectedAirlines.filter((id) => id !== airline)
                );
              }
            }}
          />
          <label htmlFor={airline} className="text-sm pr-2">
            {airline}
          </label>
          <span className="text-sm opacity-70">({airlineCounts[airline]})</span>
        </div>
      ))}
    </div>
  );
};
