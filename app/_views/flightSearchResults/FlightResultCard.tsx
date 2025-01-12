import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { FlightOffer } from "amadeus-ts";
import airlinesData from "@/lib/airlines.json";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlaneArrival,
  faPlaneDeparture,
} from "@fortawesome/free-solid-svg-icons";

type FlightResultCardProps = {
  flight: FlightOffer;
  isSelected?: boolean;
  onSelect?: () => void;
  view: "search" | "details";
};

const FlightResultCard = ({
  flight,
  isSelected,
  onSelect,
  view,
}: FlightResultCardProps) => {
  const isMobile = useIsMobile();
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

  const firstSegment = flight.itineraries[0].segments[0];
  const lastSegment =
    flight.itineraries[0].segments[flight.itineraries[0].segments.length - 1];
  const firstTakeoffTime = formatTime(firstSegment.departure.at);
  const lastLandingTime = formatTime(lastSegment.arrival.at);

  return (
    <Card
      key={flight.id}
      onClick={onSelect}
      className={cn(
        "flex flex-col rounded-lg p-4 mb-1 border border-card hover:cursor-pointer hover:shadow-sm hover:border-accent",
        isSelected && "border-stone-700 hover:border-stone-700 bg-stone-50",
        search && "w-96",
        details && "w-full"
      )}
    >
      {/* Airline and Price */}
      <CardHeader className="flex-row justify-between items-center p-0">
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
        <div className="text-xl font-bold !m-0">${flight.price.grandTotal}</div>
      </CardHeader>
      {/* Flight Details */}
      <CardContent className="p-0 space-y-1">
        {flight.itineraries.map((itinerary, itineraryIndex) => {
          const { stopsText, layoverText } = handleStopsWithLayovers(
            itinerary.segments
          );
          return (
            <div key={itineraryIndex}>
              <div className="flex justify-start items-center space-x-2 space-y-1">
                <FontAwesomeIcon
                  icon={
                    itineraryIndex === 0 ? faPlaneDeparture : faPlaneArrival
                  }
                  className="text-primary h-[35px] w-[35px] mr-[6px] opacity-50"
                />
                <div className="flex flex-1 items-start justify-between">
                  <div className="font-bold flex text-">
                    {firstTakeoffTime} - {lastLandingTime}
                  </div>
                  <div className="flex flex-col items-center text-sm font-bold ">
                    {stopsText}
                    {layoverText && (
                      <>
                        <div className="font-normal">{layoverText}</div>
                        <div className="font-normal opacity-80">
                          {itinerary.segments[0].arrival.iataCode}
                        </div>
                      </>
                    )}
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="text-sm font-bold">
                      {durationFormat(itinerary.duration)}
                    </div>
                    <div className="text-sm opacity-80">
                      {itinerary.segments[0].departure.iataCode}-
                      {
                        itinerary.segments[itinerary.segments.length - 1]
                          .arrival.iataCode
                      }
                    </div>
                  </div>
                </div>
              </div>
              {details && (
                <div
                  className={cn(
                    "flex items-center space-x-4",
                    isMobile && "justify-between"
                  )}
                >
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
                        <p>
                          Flight {segment.carrierCode} {segment.number}
                        </p>
                        <p className="text-gray-500">
                          Duration: {durationFormat(segment.duration)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default FlightResultCard;
