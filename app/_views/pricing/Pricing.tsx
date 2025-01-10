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

type FetchFlightDataParams = {
  flightOffers: FlightOffer[]; // Replace `any` with the specific type if available
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string; // Optional since it's not required for one-way flights
};

const Pricing = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { searchState } = useContext(FlightSearchContext);
  const selectedDeparture = searchState.selectedDeparture;
  const selectedReturn = searchState.selectedReturn;

  const isDefaultState =
    JSON.stringify(searchState) === JSON.stringify(defaultSearchState);

  const { loading, error, data, fetchPriceAnalysis } = useSearchPriceAnalysis();

  const handleAnalysisSubmission = async () => {
    setIsSubmitted(true);

    const flightOffers = [];

    // Use raw offers from the context
    const rawDepartureOffer = searchState.rawDepartureOffers.find(
      (offer) => offer.id === selectedDeparture?.id
    );
    const rawReturnOffer = searchState.rawReturnOffers.find(
      (offer) => offer.id === selectedReturn?.id
    );

    if (rawDepartureOffer) {
      flightOffers.push({ ...rawDepartureOffer, context: "departure" });
    }
    if (rawReturnOffer) {
      // Generate a unique alphanumeric ID for the return flight
      const modifiedReturnOffer = {
        ...rawReturnOffer,
        id: `${parseInt(rawReturnOffer.id, 10) + 10000}`, // Add offset
        context: "return",
      };
      flightOffers.push(modifiedReturnOffer);
    }

    const flightOffersForAmadeus = flightOffers.map(
      // eslint-disable-next-line
      ({ context, ...rest }) => rest
    );

    console.log("Flight Offers for Amadeus:", flightOffersForAmadeus);

    if (flightOffersForAmadeus.length > 0) {
      const apiPayload: FetchFlightDataParams = {
        flightOffers: flightOffersForAmadeus,
        origin:
          rawDepartureOffer?.itineraries[0].segments[0].departure.iataCode ||
          "",
        destination:
          rawDepartureOffer?.itineraries[0].segments[0].arrival.iataCode || "",
        departureDate:
          rawDepartureOffer?.itineraries[0].segments[0].departure.at || "",
      };

      // Add returnDate only if it exists
      if (rawReturnOffer?.itineraries[0].segments[0].departure.at) {
        apiPayload.returnDate =
          rawReturnOffer.itineraries[0].segments[0].departure.at;
      }

      await fetchPriceAnalysis(apiPayload);
    }
  };

  console.log("price data", data);

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
            <Button
              className="w-fit"
              disabled={loading}
              onClick={handleAnalysisSubmission}
            >
              {" "}
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
