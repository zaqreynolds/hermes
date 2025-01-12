"use client";
import {
  FlightSearchContext,
  defaultSearchState,
} from "@/context/FlightSearchContext";
import { useContext, useState } from "react";
import FlightResultCard from "../flightSearchResults/FlightResultCard";
import { FlightOffer } from "amadeus-ts";
import { Button } from "@/components/ui/button";
import useSearchPriceAnalysis from "./useSearchPriceAnalysis";

const Pricing = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { searchState } = useContext(FlightSearchContext);
  const { selectedFlight } = searchState;

  const isDefaultState =
    JSON.stringify(searchState) === JSON.stringify(defaultSearchState);

  const { loading, error, data, fetchPriceAnalysis } = useSearchPriceAnalysis();

  const handleAnalysisSubmission = async () => {
    setIsSubmitted(true);

    const rawFlightOffer = searchState.rawFlightOffers.find(
      (offer) => offer.id === selectedFlight?.id
    );

    if (!rawFlightOffer) {
      console.error("No matching flight offer found");
      return;
    }

    const apiPayload = {
      flightOffer: rawFlightOffer, // Pass a single flight offer
      origin: rawFlightOffer.itineraries[0].segments[0].departure.iataCode,
      destination: rawFlightOffer.itineraries[0].segments[0].arrival.iataCode,
      departureDate: rawFlightOffer.itineraries[0].segments[0].departure.at,
      oneWay: rawFlightOffer.oneWay,
      returnDate: rawFlightOffer.oneWay
        ? undefined
        : rawFlightOffer.itineraries[1]?.segments[0]?.departure.at, // Include return date if applicable
    };

    await fetchPriceAnalysis(apiPayload);
  };

  return (
    <div className="flex flex-col flex-1 w-full overflow-hidden">
      {!isDefaultState && (
        <>
          <h2 className="text-lg font-semibold mb-1">Price Analysis:</h2>
          {!selectedFlight && <div>Select a flight to continue...</div>}
          {selectedFlight && (
            <div className="flex w-full flex-col space-y-2">
              <div className="w-full">
                <div className="font-semibold">Itinerary:</div>
                <FlightResultCard
                  flight={selectedFlight as FlightOffer}
                  view="details"
                />
              </div>
            </div>
          )}
          <div className="flex w-full justify-end mt-4">
            <Button
              className="w-fit"
              disabled={loading}
              onClick={handleAnalysisSubmission}
            >
              {loading ? "Checking..." : "Check Price & Analysis"}
            </Button>
          </div>
          {isSubmitted && !loading && error && (
            <div className="text-red-500 mt-2">Error: {error}</div>
          )}
        </>
      )}
    </div>
  );
};

export default Pricing;
