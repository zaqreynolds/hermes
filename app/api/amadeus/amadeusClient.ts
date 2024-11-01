import Amadeus from "amadeus";

console.log("API Key:", process.env.AMADEUS_API_KEY);
console.log("API Secret:", process.env.AMADEUS_API_SECRET);

const amadeus = new Amadeus({
  clientId: process.env.AMADEUS_API_KEY || "",
  clientSecret: process.env.AMADEUS_API_SECRET || "",
});

export default amadeus;
