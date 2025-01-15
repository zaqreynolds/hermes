import { NextRequest, NextResponse } from "next/server";
import amadeus from "../amadeusClient";
import { CurrencyCode } from "amadeus-ts";

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const {
      flightOffer,
      origin,
      destination,
      departureDate,
      returnDate,
      oneWay,
    } = body;

    if (!flightOffer || !origin || !destination || !departureDate) {
      return NextResponse.json(
        { message: "Missing required parameters" },
        { status: 400 }
      );
    }

    const formattedDepartureDate = departureDate.split("T")[0]; // Strip time

    const itineraryPriceMetricsParams: {
      originIataCode: string;
      destinationIataCode: string;
      departureDate: string;
      currencyCode: CurrencyCode;
      oneWay: boolean;
      returnDate?: string;
    } = {
      originIataCode: origin,
      destinationIataCode: destination,
      departureDate: formattedDepartureDate,
      currencyCode: "USD" as CurrencyCode,
      oneWay: oneWay,
    };

    // Only add `returnDate` if the endpoint supports it
    if (!oneWay && returnDate) {
      delete itineraryPriceMetricsParams.returnDate; // Comment this line out if returnDate is supported
    }

    const [flightOffersPriceResponse, flightPriceAnalysisResponse] =
      await Promise.all([
        amadeus.shopping.flightOffers.pricing.post({
          data: {
            type: "flight-offers-pricing",
            flightOffers: [flightOffer],
          },
        }),

        amadeus.analytics.itineraryPriceMetrics.get(
          itineraryPriceMetricsParams
        ),
      ]);

    const flightOffersPrice = flightOffersPriceResponse.data;
    const flightPriceAnalysis = flightPriceAnalysisResponse.data;

    return NextResponse.json({ flightOffersPrice, flightPriceAnalysis });
  } catch (error) {
    console.error("Error fetching flight offers price:", error);
    return NextResponse.json(
      { message: "Error fetching flight offers price" },
      { status: 500 }
    );
  }
};
