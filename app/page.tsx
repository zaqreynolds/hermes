"use client";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";
import { useContext, useEffect, useState } from "react";
// import { AmadeusContext } from "./AmadeusContext";

export default function Home() {
  const [searchOrigin, setSearchOrigin] = useState("");
  const [searchDestination, setSearchDestination] = useState("");
  const debouncedOrigin = useDebounce(searchOrigin, 500);
  const debouncedDestination = useDebounce(searchDestination, 500);
  // const amadeusToken = useContext(AmadeusContext);
  // const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (debouncedOrigin) {
      const fetchLocations = async () => {
        //use amadeus city and airport search api
        try {
          const response = await fetch(
            `/api/amadeus/locations?keyword=${debouncedOrigin}`
          );
          const data = await response.json();
          console.log(data);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      fetchLocations();
    }
  }, [debouncedOrigin]);

  return (
    <div className="flex flex-col h-full w-full items-center">
      <h1>Hello Hermes</h1>
      <div className="flex w-full h-full flex-col px-4">
        <Input
          id="origin_search"
          className="w-full mb-2"
          type="text"
          value={searchOrigin}
          placeholder="From"
          onChange={(e) => setSearchOrigin(e.target.value)}
        />
        <Input
          id="destination_search"
          className="w-full"
          type="text"
          value={searchDestination}
          placeholder="To"
          onChange={(e) => setSearchDestination(e.target.value)}
        />
      </div>
    </div>
  );
}
