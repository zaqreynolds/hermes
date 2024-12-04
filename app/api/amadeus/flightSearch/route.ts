import { NextRequest, NextResponse } from "next/server";
import amadeus from "../amadeusClient";
import { flightSearchSchema } from "@/app/_components/flightSearchSchema";
import { max } from "date-fns";

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
    departureDate: parsed.data.departureDate.toISOString().split("T")[0], // Format YYYY-MM-DD
    returnDate: parsed.data.returnDate
      ? parsed.data.returnDate.toISOString().split("T")[0]
      : undefined, // Optional
    adults: parsed.data.travelers.adults,
    children: parsed.data.travelers.children || 0, // Default to 0 if not provided
    infants: parsed.data.travelers.infants || 0, // Default to 0 if not provided
    travelClass: parsed.data.travelClass || "ECONOMY", // Default to ECONOMY if not specified
    nonStop: parsed.data.nonStop || false, // Default to false
    max: 10, // Limit to 10 results
  };

  try {
    const response = await (amadeus as any).shopping.flightOffersSearch.get(
      requestBody
    );
    console.log("response", response);
    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    console.error("Error searching flights:", error);
    return NextResponse.json(
      { error: "Failed to fetch flight offers" },
      { status: 500 }
    );
  }
};
