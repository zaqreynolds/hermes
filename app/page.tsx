import { Suspense } from "react";
import FlightSearchForm from "./_views/flightSearchForm/FlightSearchForm";
import { FlightSearchResults } from "./_views/flightSearchResults/FlightSearchResults";
import Pricing from "./_views/pricing/Pricing";
import { FlightSearchResultsToolBar } from "./_views/flightSearchResults/toolbar/FlightSearchResultsToolbar";

export default function Home() {
  return (
    <div className="w-full flex overflow-hidden mt-1 px-4">
      <FlightSearchResultsToolBar />
      <div className="flex flex-col overflow-hidden">
        <Suspense fallback={<div>Loading Flight Search Form...</div>}>
          <FlightSearchForm />
        </Suspense>
        <div className="flex flex-col w-fit overflow-auto">
          <Suspense fallback={<div>Loading Flight Search Results...</div>}>
            <FlightSearchResults />
          </Suspense>
          <Suspense fallback={<div>Loading Pricing and Analysis...</div>}>
            <Pricing />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
