import { NextRequest, NextResponse } from "next/server";
import amadeus from "../amadeusClient";

export const GET = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const keyword = searchParams.get("keyword");
  console.log("Keyword:", keyword);

  if (!keyword) {
    return NextResponse.json(
      { error: "Keyword must be a string" },
      { status: 400 }
    );
  }

  try {
    const response = await amadeus.referenceData.locations.get({
      keyword,
      subType: "AIRPORT",
    });

    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    console.error("Amadeus API error:", error);
    return NextResponse.json(
      { error: "Error fetching location data" },
      { status: 500 }
    );
  }
};
