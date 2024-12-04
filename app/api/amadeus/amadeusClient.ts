import Amadeus from "amadeus";

const amadeus = new Amadeus({
  clientId: process.env.AMADEUS_API_KEY || "",
  clientSecret: process.env.AMADEUS_API_SECRET || "",
});
// console.log("api key", process.env.AMADEUS_API_KEY);
// console.log("api secret", process.env.AMADEUS_API_SECRET);
// console.log(amadeus);

export default amadeus;
