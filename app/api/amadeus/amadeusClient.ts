import Amadeus from "amadeus-ts";

const amadeus = new Amadeus({
  clientId: process.env.AMADEUS_API_KEY || "",
  clientSecret: process.env.AMADEUS_API_SECRET || "",
  hostname: "production",
});

export default amadeus;
