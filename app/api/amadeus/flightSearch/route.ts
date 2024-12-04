import { NextRequest, NextResponse } from "next/server";
// import amadeus from "../amadeusClient";
import { flightSearchSchema } from "@/app/_components/flightSearchSchema";

export const POST = async (req: NextRequest) => {
  const data = await req.json();
  data.departureDate = new Date(data.departureDate);
  if (data.returnDate) {
    data.returnDate = new Date(data.returnDate);
  }
  console.log("data in flight search route", data);
  const parsed = flightSearchSchema.safeParse(data);
  console.log("parsed in flight search route", parsed);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  } else {
    console.log("successful flight search request", parsed.data);
    return NextResponse.json(parsed.data, { status: 200 });
  }
};
