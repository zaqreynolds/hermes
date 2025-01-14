import { NextRequest, NextResponse } from "next/server";
import amadeus from "../amadeusClient";
import { CurrencyCode } from "amadeus-ts";

export const POST = async (req: NextRequest) => {
  console.log("starting price analysis");
  try {
    const body = await req.json();
    console.log("Request body:", JSON.stringify(body, null, 2));
    const {
      flightOffer,
      origin,
      destination,
      departureDate,
      returnDate,
      oneWay,
    } = body;

    console.log("flightOffer structure:", JSON.stringify(flightOffer, null, 2));

    if (!flightOffer || !origin || !destination || !departureDate) {
      return NextResponse.json(
        { message: "Missing required parameters" },
        { status: 400 }
      );
    }

    const formattedDepartureDate = departureDate.split("T")[0]; // Strip time
    const formattedReturnDate = returnDate?.split("T")[0]; // Strip time if returnDate exists

    console.log("Formatted dates:", {
      departureDate: formattedDepartureDate,
      returnDate: formattedReturnDate,
    });

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
      console.log("Removing returnDate for itineraryPriceMetrics");
      delete itineraryPriceMetricsParams.returnDate; // Comment this line out if returnDate is supported
    }

    console.log("itineraryPriceMetricsParams:", itineraryPriceMetricsParams);

    console.log("Payload sent to flightOffersPricing:", {
      type: "flight-offers-pricing",
      flightOffers: [flightOffer],
    });
    console.log(
      "Payload sent to itineraryPriceMetrics:",
      itineraryPriceMetricsParams
    );

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

    console.log("flightOffersPriceResponse:", flightOffersPriceResponse);
    console.log("flightPriceAnalysisResponse:", flightPriceAnalysisResponse);

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
