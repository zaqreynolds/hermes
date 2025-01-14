import { Suspense } from "react";
import FlightSearchForm from "./_views/flightSearchForm/FlightSearchForm";
import { FlightSearchResults } from "./_views/flightSearchResults/FlightSearchResults";
import Pricing from "./_views/pricing/Pricing";

export default function Home() {
  return (
    <div className="w-full flex flex-col overflow-auto items-center mt-1 px-4">
      <Suspense fallback={<div>Loading Flight Search Form...</div>}>
        <FlightSearchForm />
      </Suspense>
      <div className="flex w-full max-w-[1155px] overflow-hidden">
        <Suspense fallback={<div>Loading Flight Search Results...</div>}>
          <FlightSearchResults />
        </Suspense>
        <Suspense fallback={<div>Loading Pricing and Analysis...</div>}>
          <Pricing />
        </Suspense>
      </div>
    </div>
  );
}
