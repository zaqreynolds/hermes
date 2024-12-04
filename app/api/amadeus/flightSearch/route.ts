import { NextRequest, NextResponse } from "next/server";
import amadeus from "../amadeusClient";
import { flightSearchSchema } from "@/app/_components/flightSearchSchema";

const decodeFlightOffer = (offer: FlightOffer, dictionaries: Dictionaries) => {
  const { locations, carriers, aircraft } = dictionaries;

  return {
    ...offer,
    itineraries: offer.itineraries.map((itinerary) => ({
      ...itinerary,
      segments: itinerary.segments.map((segment) => ({
        ...segment,
        departure: {
          ...segment.departure,
          airport:
            locations[segment.departure.iataCode]?.name ||
            segment.departure.iataCode,
        },
        arrival: {
          ...segment.arrival,
          airport:
            locations[segment.arrival.iataCode]?.name ||
            segment.arrival.iataCode,
        },
        carrier: carriers[segment.carrierCode] || segment.carrierCode,
        aircraft: aircraft[segment.aircraft.code] || segment.aircraft.code,
      })),
    })),
  };
};

export const POST = async (req: NextRequest) => {
  const data = await req.json();
  data.departureDate = new Date(data.departureDate);
  if (data.returnDate) {
    data.returnDate = new Date(data.returnDate);
  }

  const parsed = flightSearchSchema.safeParse(data);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }

  const requestBody = {
    originLocationCode: parsed.data.origin.iataCode,
    destinationLocationCode: parsed.data.destination.iataCode,
    departureDate: parsed.data.departureDate.toISOString().split("T")[0],
    returnDate: parsed.data.returnDate
      ? parsed.data.returnDate.toISOString().split("T")[0]
      : undefined,
    adults: parsed.data.travelers.adults,
    children: parsed.data.travelers.children || 0,
    infants: parsed.data.travelers.infants || 0,
    travelClass: parsed.data.travelClass || "ECONOMY",
    nonStop: parsed.data.nonStop || false,
    max: 10,
  };

  try {
    const response = await amadeus.shopping.flightOffersSearch.get(requestBody);

    const { data: flightOffers, result } = response;
    const { dictionaries } = result;

    const processedFlightOffers = flightOffers.map((offer) =>
      decodeFlightOffer(offer, dictionaries)
    );
    console.log("processedFlightOffers", processedFlightOffers);
    return NextResponse.json(processedFlightOffers, { status: 200 });
  } catch (error) {
    console.error("Error searching flights:", error);
    return NextResponse.json(
      { error: "Failed to fetch flight offers" },
      { status: 500 }
    );
  }
};
