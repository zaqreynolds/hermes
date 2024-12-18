import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { FlightOffer } from "amadeus-ts";
import airlinesData from "@/lib/airlines.json";
import Image from "next/image";

type FlightResultCardProps = {
  flight: FlightOffer;
  isSelected: boolean;
  onSelect: () => void;
};

const FlightResultCard = ({
  flight,
  isSelected,
  onSelect,
}: FlightResultCardProps) => {
  const isMobile = useIsMobile();

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

    if (stops === 0) return "Non-stop";

    const layoverTimes = segments.slice(0, -1).map((segment, index) => {
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
      : "/logos/default_logo.png";
  };
  return (
    <Card
      key={flight.id}
      onClick={onSelect}
      className={cn(
        "flex flex-col rounded-lg p-4 shadow-md mb-1 max-w-[571px] h-[181px] hover:cursor-pointer hover:shadow-xl",
        isSelected && "border-2 border-blue-500 bg-blue-50"
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
            <div
              className={cn(
                "flex items-center space-x-4",
                isMobile && "justify-between"
              )}
            >
              {itinerary.segments.map((segment, segmentIndex) => (
                <div key={segmentIndex} className="flex items-center space-x-4">
                  {/* Segment Details */}
                  <div className="text-sm text-gray-800">
                    <p className="font-medium">
                      {formatTime(segment.departure.at)} -{" "}
                      {formatTime(segment.arrival.at)}
                    </p>
                    <p>
                      {segment.departure.iataCode} → {segment.arrival.iataCode}
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
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default FlightResultCard;
