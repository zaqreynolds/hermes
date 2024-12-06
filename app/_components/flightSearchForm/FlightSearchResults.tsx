import { FlightOffer } from "amadeus-ts";

interface FlightSearchResultsProps {
  flightResults: FlightOffer[];
}

export const FlightSearchResults = ({
  flightResults,
}: FlightSearchResultsProps) => {
  console.log("heloooo", flightResults);
  return (
    <div>
      {flightResults.map((flight) => (
        <div key={flight.id}>
          <h2>{flight.id}</h2>
          <h3>{flight.price.total}</h3>
        </div>
      ))}
    </div>
  );
};
