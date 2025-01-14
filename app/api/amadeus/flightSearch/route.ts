import { NextRequest, NextResponse } from "next/server";
import amadeus from "../amadeusClient";
import { compactFlightSearchSchema } from "../../../_views/flightSearchForm/flightSearchSchema";
import { Dictionaries, Itinerary, Segment, TravelerPricing } from "./types";
import { CurrencyCode, FlightOffer, TravelClass } from "amadeus-ts";
import { toPascalCase } from "@/lib/utils";
import { OperatingFlight$1 } from "@/app/amadeusTypes";

const decodeFlightOffer = (
  offer: FlightOffer,
  dictionaries: Dictionaries
): DecodedFlightOffer => {
  const { carriers, aircraft } = dictionaries;

  const decodedItineraries: DecodedItinerary[] = offer.itineraries.map(
    (itinerary) => ({
      ...itinerary,
      segments: itinerary.segments.map((segment) => ({
        ...segment, // Ensure this has all required fields
        id: segment.id, // Explicitly add required fields
        numberOfStops: segment.numberOfStops, // Explicitly add required fields
        blacklistedInEU: segment.blacklistedInEU, // Explicitly add required fields
        carrier:
          toPascalCase(carriers[segment.carrierCode]) || segment.carrierCode,
        decodedAircraft:
          toPascalCase(aircraft[segment.aircraft.code]) ||
          segment.aircraft.code,
      })),
    })
  );

  return {
    ...offer, // Include all existing fields
    itineraries: decodedItineraries, // Replace itineraries with decoded ones
    validatingAirlineCodes:
      offer.validatingAirlineCodes?.map(
        (code) => toPascalCase(carriers[code]) || code
      ) || [],
  };
};

export const POST = async (req: NextRequest) => {
  const data = await req.json();

  data.departureDate = new Date(data.departureDate);
  if (data.returnDate) data.returnDate = new Date(data.returnDate);

  const parsed = compactFlightSearchSchema.safeParse(data);

  if (!parsed.success) {
    console.error("Validation errors:", parsed.error.errors);
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }

  const requestBody = {
    originLocationCode: parsed.data.origin,
    destinationLocationCode: parsed.data.destination,
    departureDate: parsed.data.departureDate.toISOString().split("T")[0],
    returnDate: parsed.data.returnDate
      ? parsed.data.returnDate.toISOString().split("T")[0]
      : undefined,
    adults: parsed.data.travelers.adults,
    children: parsed.data.travelers.children || 0,
    infants: parsed.data.travelers.infants || 0,
    travelClass: (parsed.data.travelClass as TravelClass) || "ECONOMY",
    nonStop: parsed.data.nonStop || false,
    currencyCode: "USD" as CurrencyCode,
    max: 50,
  };

  try {
    const response = await amadeus.shopping.flightOffersSearch.get(requestBody);

    const { data: flightOffers, result } = response as {
      data: FlightOffer[];
      result: { dictionaries: Dictionaries };
    };

    // const parseAsEndOfDayUTC = (dateString: string): Date => {
    //   return new Date(`${dateString}T23:59:59Z`); // Set to end of the day in UTC
    // };
    // const now = new Date();
    // const validFlightOffers = flightOffers.filter((offer) => {
    //   const lastTicketingDateTime = offer.lastTicketingDateTime
    //     ? new Date(offer.lastTicketingDateTime)
    //     : parseAsEndOfDayUTC;

    //   return lastTicketingDateTime >= now; // Keep only offers that are still valid
    // });

    const decodedFlightOffers = flightOffers.map((offer) =>
      decodeFlightOffer(
        offer as FlightOffer & { travelerPricings: TravelerPricing[] },
        result.dictionaries
      )
    );

    return NextResponse.json(
      {
        rawFlightOffers: flightOffers,
        decodedFlightOffers,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching flight offers:", error);
    return NextResponse.json(
      { error: "Failed to fetch flight offers" },
      { status: 500 }
    );
  }
};

interface DecodedSegment extends Segment {
  id: string;
  numberOfStops: number;
  blacklistedInEU: boolean;
  carrier?: string; // Decoded carrier name
  decodedAircraft?: string; // Decoded aircraft name
  operating: OperatingFlight$1; // Add the missing 'operating' property
}

interface DecodedItinerary extends Itinerary {
  segments: DecodedSegment[]; // Use the extended DecodedSegment type
}

export interface DecodedFlightOffer extends FlightOffer {
  itineraries: DecodedItinerary[]; // Use the extended DecodedItinerary type
  validatingAirlineCodes?: string[]; // Decoded airline codes
}
