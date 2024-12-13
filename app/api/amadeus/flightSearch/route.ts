import { NextRequest, NextResponse } from "next/server";
import amadeus from "../amadeusClient";
import { compactFlightSearchSchema } from "../../../_components/flightSearchForm/flightSearchSchema";
import { Dictionaries, TravelerPricing } from "./types";
import { FlightOffer, TravelClass } from "amadeus-ts";

const decodeFlightOffer = (
  offer: FlightOffer & { travelerPricings: TravelerPricing[] },
  dictionaries: Dictionaries
) => {
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
  console.log("Received request body:", data);
  data.departureDate = new Date(data.departureDate);
  // if (data.returnDate) {
  //   data.returnDate = new Date(data.returnDate);
  // }

  const parsed = compactFlightSearchSchema.safeParse(data);

  if (!parsed.success) {
    console.error("Validation errors:", parsed.error);
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }

  const requestBody = {
    originLocationCode: parsed.data.origin,
    destinationLocationCode: parsed.data.destination,
    departureDate: parsed.data.departureDate.toISOString().split("T")[0],
    // returnDate: parsed.data.returnDate
    //   ? parsed.data.returnDate.toISOString().split("T")[0]
    //   : undefined,
    adults: parsed.data.travelers.adults,
    children: parsed.data.travelers.children || 0,
    infants: parsed.data.travelers.infants || 0,
    travelClass: (parsed.data.travelClass as TravelClass) || "ECONOMY",
    nonStop: parsed.data.nonStop || false,
    max: 10,
  };

  try {
    console.log("Searching flights with request body:", requestBody);
    const response = await amadeus.shopping.flightOffersSearch.get(requestBody);
    console.log("API response:", response);

    const { data: flightOffers, result } = response;
    const { dictionaries } = result;

    if (!dictionaries) {
      throw new Error("Dictionaries is undefined");
    }
    const processedFlightOffers = flightOffers.map((offer) => {
      if (!offer.travelerPricings) {
        throw new Error("TravelerPricings is undefined");
      }
      return decodeFlightOffer(
        offer as FlightOffer & { travelerPricings: TravelerPricing[] },
        dictionaries
      );
    });
    return NextResponse.json(processedFlightOffers, { status: 200 });
  } catch (error) {
    console.error("Error searching flights:", error);
    return NextResponse.json(
      { error: "Failed to fetch flight offers" },
      { status: 500 }
    );
  }
};
