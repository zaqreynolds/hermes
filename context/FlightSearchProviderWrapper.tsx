"use client";

import { FlightSearchProvider } from "./FlightSearchContext";

const FlightSearchProviderWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <FlightSearchProvider>{children}</FlightSearchProvider>;
};

export default FlightSearchProviderWrapper;
