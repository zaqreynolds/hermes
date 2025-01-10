import { NextRequest, NextResponse } from "next/server";
import amadeus from "../amadeusClient";

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const {
      flightOffers,
      origin,
      destination,
      departureDate,
      returnDate,
      oneWay,
    } = body;

    if (!flightOffers || !origin || !destination || !departureDate) {
      return NextResponse.json(
        { message: "Missing required parameters" },
        { status: 400 }
      );
    }
    const itineraryPriceMetricsParams: any = {
      originIataCode: origin,
      destinationIataCode: destination,
      departureDate: departureDate,
      currencyCode: "USD",
      oneWay: oneWay,
    };

    if (!oneWay && returnDate) {
      itineraryPriceMetricsParams.returnDate = returnDate; // Only include returnDate if not one-way
    }

    const [flightOffersPriceResponse, flightPriceAnalysisResponse] =
      await Promise.all([
        amadeus.shopping.flightOffers.pricing.post({
          data: {
            type: "flight-offers-pricing",
            flightOffers,
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
