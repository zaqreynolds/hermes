"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { FlightSearchContext } from "@/context/FlightSearchContext";
import { durationFormat } from "@/lib/utils";
import { FlightOffer } from "amadeus-ts";
import { useContext } from "react";

export const FlightSearchResults = () => {
  const { searchState } = useContext(FlightSearchContext);

  const departureOffers = searchState.departureOffers as FlightOffer[];
  console.log("departureOffers", departureOffers);

  const handleStopsWithLayovers = (
    segments: FlightOffer["itineraries"][0]["segments"]
  ) => {
    const stops = segments.length - 1;

    if (stops === 0) return "Non-stop";

    const layoverTimes = segments
      .slice(0, -1) // Exclude the last segment since no layover follows it
      .map((segment, index) => {
        const nextSegment = segments[index + 1];
        const arrivalTime = new Date(segment.arrival.at);
        const departureTime = new Date(nextSegment.departure.at);
        const layoverMinutes =
          (departureTime.getTime() - arrivalTime.getTime()) / (1000 * 60);
        return `${Math.floor(layoverMinutes / 60)}h ${layoverMinutes % 60}m`;
      });

    return `${stops} stop${stops > 1 ? "s" : ""} (${layoverTimes.join(", ")})`;
  };

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Available Flights:</h2>
      {departureOffers.map((flight) => (
        <Card
          key={flight.id}
          className="flex flex-col rounded-lg p-4 shadow-md mb-1"
        >
          {/* Airline and Price */}
          <CardHeader className="flex-row justify-between p-0">
            <h3 className="text-md font-semibold">
              {flight.validatingAirlineCodes?.[0] || "Unknown Airline"}
            </h3>
            <p className="text-xl font-bold">${flight.price.grandTotal}</p>
          </CardHeader>
          {/* Flight Details */}
          <CardContent className="p-0">
            {flight.itineraries.map((itinerary, itineraryIndex) => (
              <div key={itineraryIndex} className="space-y-2">
                <div className="text-sm text-gray-600">
                  Duration: {durationFormat(itinerary.duration)} |{" "}
                  {handleStopsWithLayovers(itinerary.segments)}
                </div>
                <div className="flex items-center space-x-4">
                  {itinerary.segments.map((segment, segmentIndex) => (
                    <div
                      key={segmentIndex}
                      className="flex items-center space-x-4"
                    >
                      {/* Segment Details */}
                      <div className="text-sm text-gray-800">
                        <p className="font-medium">
                          {formatTime(segment.departure.at)} -{" "}
                          {formatTime(segment.arrival.at)}
                        </p>
                        <p>
                          {segment.departure.iataCode} →{" "}
                          {segment.arrival.iataCode}
                        </p>
                        <p className="text-gray-500">
                          Duration: {durationFormat(segment.duration)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
      {departureOffers.length === 0 && <div>No results yet</div>}
    </div>
  );
};
