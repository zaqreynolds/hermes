"use client";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";
import { useEffect, useState } from "react";
import {
  faPlaneArrival,
  faPlaneDeparture,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Home() {
  const [searchOrigin, setSearchOrigin] = useState("");
  const [searchDestination, setSearchDestination] = useState("");
  const debouncedOrigin = useDebounce(searchOrigin, 500);
  const debouncedDestination = useDebounce(searchDestination, 500);

  useEffect(() => {
    if (debouncedOrigin) {
      const fetchLocations = async () => {
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
        <h3>Where would you like to fly to?</h3>
        <div className="relative flex items-center ">
          <FontAwesomeIcon
            icon={faPlaneDeparture}
            className="absolute left-3 h-5 w-5 mb-1"
          />
          <Input
            id="origin_search"
            className="w-full mb-2 pl-10"
            type="text"
            value={searchOrigin}
            placeholder="From"
            onChange={(e) => setSearchOrigin(e.target.value)}
          />
        </div>
        <div className="relative flex items-center ">
          <FontAwesomeIcon
            icon={faPlaneArrival}
            className="absolute left-3 h-5 w-5 mb-1"
          />
          <Input
            id="departure_search"
            className="w-full mb-2 pl-10"
            type="text"
            value={searchDestination}
            placeholder="To"
            onChange={(e) => setSearchOrigin(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
