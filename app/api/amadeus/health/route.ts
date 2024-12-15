import { NextResponse } from "next/server";
import amadeus from "../amadeusClient";

export const GET = async () => {
  console.log("checking health");
  try {
    const response = await amadeus.referenceData.locations.get({
      keyword: "test",
      subType: "AIRPORT",
    });
    console.log("health response", response);
    if (response.statusCode === 200) {
      return NextResponse.json(null, { status: 200 });
    } else {
      return NextResponse.json(
        { message: "Amadeus is currently down..." },
        { status: 503 }
      );
    }
  } catch (error) {
    console.error("Amadeus API error:", error);

    if (error && typeof error === "object" && "response" in error) {
      const apiError = error as {
        response: { statusCode: number; body: string };
      };
      const statusCode = apiError.response?.statusCode || 500;
      const body = apiError.response?.body || "An unknown error occurred.";

      console.error("Error details:", { statusCode, body });

      return NextResponse.json(
        { error: `Amadeus API error: ${body}` },
        { status: statusCode }
      );
    }

    return NextResponse.json(
      { error: "Error fetching location data" },
      { status: 500 }
    );
  }
};
