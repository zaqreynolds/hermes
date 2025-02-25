import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn, toPascalCase } from "@/lib/utils";
import { FlightOffer } from "amadeus-ts";
import airlinesData from "@/lib/airlines.json";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlaneArrival,
  faPlaneDeparture,
} from "@fortawesome/free-solid-svg-icons";
import { DecodedFlightOffer } from "@/app/api/amadeus/flightSearch/route";
import { FlightPricingResponse } from "../pricing/useSearchPriceAnalysis";
import { useEffect, useState } from "react";

type FlightResultCardProps = {
  flight: DecodedFlightOffer;
  isSelected?: boolean;
  onSelect?: () => void;
  view: "search" | "details";
  priceData?: FlightPricingResponse;
};

const FlightResultCard = ({
  flight,
  isSelected,
  onSelect,
  view: initialView,
}: FlightResultCardProps) => {
  const isMobile = useIsMobile();

  const [view, setView] = useState<"search" | "details">(initialView);

  useEffect(() => {
    if (!isMobile) return;
    if (isSelected) {
      setView("details");
    } else {
      setView(initialView);
    }
  }, [isSelected, initialView, isMobile]);

  const search = view === "search";
  const details = view === "details";

  const durationFormat = (duration: string) => {
    const regex = /PT(?:(\d+)H)?(?:(\d+)M)?/;
    const match = duration.match(regex);

    const hours = match && match[1] ? parseInt(match[1], 10) : 0;
    const minutes = match && match[2] ? parseInt(match[2], 10) : 0;

    const formattedParts = [];
    if (hours > 0) {
      formattedParts.push(`${hours}h`);
    }
    if (minutes > 0) {
      formattedParts.push(`${minutes}m`);
    }
    return formattedParts.length > 0 ? formattedParts.join(" ") : "0m";
  };

  const handleStopsWithLayovers = (
    segments: FlightOffer["itineraries"][0]["segments"]
  ) => {
    const stops = segments.length - 1;

    if (stops === 0) {
      return {
        stopsText: "Non-stop",
        layoverText: null,
      };
    }

    const layoverTimes = segments.slice(0, -1).map((segment, index) => {
      const nextSegment = segments[index + 1];
      const arrivalTime = new Date(segment.arrival.at);
      const departureTime = new Date(nextSegment.departure.at);
      const layoverMinutes =
        (departureTime.getTime() - arrivalTime.getTime()) / (1000 * 60);

      if (layoverMinutes >= 60) {
        const hours = Math.floor(layoverMinutes / 60);
        const minutes = layoverMinutes % 60;
        return `${hours}h ${minutes > 0 ? `${minutes}m` : ""}`;
      } else {
        return `${layoverMinutes}m`;
      }
    });

    return {
      stopsText: `${stops} stop${stops > 1 ? "s" : ""}`,
      layoverText: layoverTimes.join(", "),
    };
  };

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  };

  const getICAOFromIATA = (iataCode: string): string | null => {
    const airline = airlinesData.airlines.find(
      (airline) => airline.IATA === iataCode
    );
    return airline ? airline.ICAO : null;
  };

  const getAirlineLogoUrl = (iataCode: string): string => {
    const icaoCode = getICAOFromIATA(iataCode);
    return icaoCode
      ? `/logos/flightaware_logos/${icaoCode}.png`
      : "/logos/defaultHermes.png";
  };

  if (!flight || !flight.itineraries || !flight.itineraries[0]) {
    return (
      <p className="text-center text-sm text-gray-500">
        Select flights to continue..
      </p>
    );
  }

  return (
    <Card
      key={flight.id}
      onClick={onSelect}
      className={cn(
        "flex flex-col rounded-lg mb-1 border border-card bg-background-alt hover:shadow-md",
        isSelected && "border-stone-700 hover:border-stone-700 bg-card",
        search && !isMobile && "w-96 hover:cursor-pointer hover:border-accent",
        details && "w-full",
        isMobile && "w-[100%] p-2",
        !isMobile && "p-4"
      )}
    >
      {/* Airline and Price */}
      <CardHeader
        className={cn(
          "flex-row justify-between items-center p-0",
          isMobile && "mb-1"
        )}
      >
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 flex items-center justify-center rounded">
            <Image
              src={getAirlineLogoUrl(
                flight.itineraries[0].segments[0].carrierCode
              )}
              alt={flight.itineraries[0].segments[0].carrierCode}
              className="w-full h-full object-contain"
              width={40}
              height={40}
            />
          </div>
          <h3 className="text-md font-semibold">
            {flight.validatingAirlineCodes?.[0] || "Unknown Airline"}
          </h3>
        </div>
        <div className="flex flex-col items-center">
          <div className="text-xl font-bold !m-0">
            ${flight.price.grandTotal}
          </div>
          {details && (
            <div className="text-sm">
              {toPascalCase(
                flight?.travelerPricings?.[0]?.fareDetailsBySegment?.[0]
                  ?.cabin || ""
              )}
            </div>
          )}
        </div>
      </CardHeader>
      {/* Flight Details */}
      <CardContent className="p-0 space-y-1">
        {flight.itineraries.map((itinerary, itineraryIndex) => {
          const { stopsText, layoverText } = handleStopsWithLayovers(
            itinerary.segments
          );

          return (
            <div key={itineraryIndex}>
              <div className="flex justify-start items-center space-x-2">
                {/* Departure/Arrival Icon */}
                <FontAwesomeIcon
                  icon={
                    itineraryIndex === 0 ? faPlaneDeparture : faPlaneArrival
                  }
                  className={cn(
                    "text-primary opacity-50",
                    !isMobile && "h-[35px] w-[35px] mr-[6px]",
                    isMobile && !isSelected && "h-[30px] w-[30px] mr-[6px]",
                    isMobile && isSelected && "h-[30px] w-[30px] mr-[4px]"
                  )}
                />

                {/* Main Row Layout */}
                <div className="flex flex-1 items-start justify-between">
                  {/* Left Column: Flight Time */}
                  <div
                    className={cn(
                      !(isMobile && isSelected) && "flex-1",
                      isMobile && isSelected && "flex-1"
                    )}
                  >
                    <div className="font-bold">
                      {formatTime(itinerary.segments[0].departure.at)} -{" "}
                      {formatTime(
                        itinerary.segments[itinerary.segments.length - 1]
                          .arrival.at
                      )}
                    </div>
                    {/* Segment Details */}
                    {details && (
                      <div className="flex items-start space-x-4 mt-2">
                        {itinerary.segments.map((segment, segmentIndex) => (
                          <div
                            key={segmentIndex}
                            className="flex flex-col space-y-1"
                          >
                            <div className="text-sm text-primary">
                              <p>
                                {segment.carrierCode} {segment.number}
                              </p>
                              <p>{segment.decodedAircraft}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Middle Column: Stops and Layovers */}
                  <div
                    className={cn(
                      "flex flex-col text-center",
                      view === "details" && !isMobile && "mr-20",
                      view === "search" && "mx-[10px]",
                      isMobile && isSelected && "w-[17%]"
                    )}
                  >
                    <div className="font-bold">{stopsText}</div>
                    {layoverText && (
                      <div className="text-sm text-gray-500">{layoverText}</div>
                    )}
                  </div>

                  {/* Right Column: Duration and Route */}
                  <div
                    className={cn(
                      "flex flex-col text-center",
                      isMobile && isSelected && "w-[30%]"
                    )}
                  >
                    <div className="font-bold">
                      {durationFormat(itinerary.duration)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {itinerary.segments[0].departure.iataCode} →{" "}
                      {
                        itinerary.segments[itinerary.segments.length - 1]
                          .arrival.iataCode
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default FlightResultCard;
