import { NextRequest, NextResponse } from "next/server";
import amadeus from "../amadeusClient";
import { compactFlightSearchSchema } from "../../../_views/flightSearchForm/flightSearchSchema";
import { Dictionaries, TravelerPricing } from "./types";
import { CurrencyCode, FlightOffer, TravelClass } from "amadeus-ts";
import { toPascalCase } from "@/lib/utils";

const decodeFlightOffer = (
  offer: FlightOffer & { travelerPricings: TravelerPricing[] },
  dictionaries: Dictionaries
) => {
  const { carriers, aircraft } = dictionaries;

  const decodedItineraries = offer.itineraries.map((itinerary) => ({
    ...itinerary,
    segments: itinerary.segments.map((segment) => ({
      ...segment,
      carrier:
        toPascalCase(carriers[segment.carrierCode]) || segment.carrierCode,
      decodedAircraft:
        toPascalCase(aircraft[segment.aircraft.code]) || segment.aircraft.code,
    })),
  }));

  return {
    ...offer,
    itineraries: decodedItineraries,
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
  };

  try {
    const response = await amadeus.shopping.flightOffersSearch.get(requestBody);

    const { data: flightOffers, result } = response as {
      data: FlightOffer[];
      result: { dictionaries: Dictionaries };
    };

    const decodedFlightOffers = flightOffers.map((offer) =>
      decodeFlightOffer(
        offer as FlightOffer & { travelerPricings: TravelerPricing[] },
        result.dictionaries
      )
    );

    // Return the response
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
