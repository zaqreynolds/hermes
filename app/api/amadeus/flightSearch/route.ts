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
  const { locations, carriers, aircraft } = dictionaries;

  return {
    ...offer,
    itineraries: offer.itineraries.map((itinerary) => ({
      ...itinerary,
      segments: itinerary.segments.map((segment) => ({
        ...segment,
        carrier:
          toPascalCase(carriers[segment.carrierCode]) || segment.carrierCode,
        aircraft:
          toPascalCase(aircraft[segment.aircraft.code]) ||
          segment.aircraft.code,
      })),
    })),
    validatingAirlineCodes:
      offer.validatingAirlineCodes?.map(
        (code) => toPascalCase(carriers[code]) || code
      ) || [],
  };
};

export const POST = async (req: NextRequest) => {
  const data = await req.json();

  if (data.returnDate) {
    data.returnDate = new Date(data.returnDate);
  }
  data.departureDate = new Date(data.departureDate);

  const parsed = compactFlightSearchSchema.safeParse(data);

  if (!parsed.success) {
    console.error("Validation errors:", parsed.error.errors);
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
  const departureBody = {
    originLocationCode: parsed.data.origin,
    destinationLocationCode: parsed.data.destination,
    departureDate: parsed.data.departureDate.toISOString().split("T")[0],
    adults: parsed.data.travelers.adults,
    children: parsed.data.travelers.children || 0,
    infants: parsed.data.travelers.infants || 0,
    travelClass: (parsed.data.travelClass as TravelClass) || "ECONOMY",
    nonStop: parsed.data.nonStop || false,
    currencyCode: "USD" as CurrencyCode,
  };

  const returnBody = {
    ...departureBody,
    originLocationCode: parsed.data.destination,
    destinationLocationCode: parsed.data.origin,
    departureDate: parsed.data.returnDate
      ? parsed.data.returnDate.toISOString().split("T")[0]
      : "",
  };

  try {
    const [departureResponse, returnResponse] = await Promise.all([
      amadeus.shopping.flightOffersSearch.get(departureBody),
      parsed.data.returnDate
        ? amadeus.shopping.flightOffersSearch.get(returnBody)
        : Promise.resolve(null),
    ]);

    const { data: departureOffers, result: departureResult } =
      departureResponse as {
        data: FlightOffer[];
        result: { dictionaries: Dictionaries };
      };

    const { data: returnOffers, result: returnResult } = returnResponse as {
      data: FlightOffer[];
      result: { dictionaries: Dictionaries };
    };

    const decodedDepartureOffers = departureOffers.map((offer) =>
      decodeFlightOffer(
        offer as FlightOffer & { travelerPricings: TravelerPricing[] },
        departureResult.dictionaries
      )
    );

    const decodedReturnOffers = returnOffers.map((offer) =>
      decodeFlightOffer(
        offer as FlightOffer & { travelerPricings: TravelerPricing[] },
        returnResult.dictionaries
      )
    );
    return NextResponse.json(
      {
        departureOffers: decodedDepartureOffers,
        returnOffers: decodedReturnOffers,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error searching flights:", error);
    return NextResponse.json(
      { error: "Failed to fetch flight offers" },
      { status: 500 }
    );
  }
};
