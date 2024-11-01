"use client";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";
import { useEffect, useState } from "react";
import {
  faPlaneArrival,
  faPlaneDeparture,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@/components/ui/button";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Address {
  cityName: string;
  cityCode: string;
  countryName: string;
  countryCode: string;
  stateCode: string;
  [key: string]: any; // Add other properties as needed
}

interface Analytics {
  travelers: {
    score: number;
  };
}

interface GeoCode {
  latitude: number;
  longitude: number;
}

interface Self {
  href: string;
  methods: string[];
}

interface AmadeusLocation {
  address: Address;
  analytics: Analytics;
  detailedName: string;
  geoCode: GeoCode;
  iataCode: string;
  id: string;
  name: string;
  self: Self;
  subType: string;
  timeZoneOffset: string;
  type: string;
  [key: string]: any; // Add other properties as needed
}

export default function Home() {
  const [searchOrigin, setSearchOrigin] = useState("");
  const [searchDestination, setSearchDestination] = useState("");
  const [locationData, setLocationData] = useState<[AmadeusLocation | null]>([
    null,
  ]);
  const [activeInput, setActiveInput] = useState<
    "origin" | "destination" | null
  >(null);
  const debouncedOrigin = useDebounce(searchOrigin, 500);
  const debouncedDestination = useDebounce(searchDestination, 500);

  useEffect(() => {
    const fetchLocations = async (keyword: string) => {
      try {
        const response = await fetch(
          `/api/amadeus/locations?keyword=${keyword}`
        );
        const data = await response.json();
        setLocationData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (debouncedOrigin) {
      fetchLocations(debouncedOrigin);
      setActiveInput("origin");
    }

    if (debouncedDestination) {
      fetchLocations(debouncedDestination);
      setActiveInput("destination");
    }
  }, [debouncedOrigin, debouncedDestination]);

  const handleOriginClear = () => setSearchOrigin("");
  const handleDestinationClear = () => setSearchDestination("");

  return (
    <div className="flex flex-col h-full w-full items-center">
      <h1>Hello Hermes</h1>
      <div className="flex w-full h-full flex-col px-4">
        <h3>Where would you like to fly to?</h3>
        <div className="relative flex items-center ">
          <Popover>
            <FontAwesomeIcon
              icon={faPlaneDeparture}
              className="absolute left-3 h-5 w-5 mb-1"
            />
            <PopoverTrigger asChild>
              <Input
                id="origin_search"
                className="w-full mb-2 px-10"
                type="text"
                value={searchOrigin}
                placeholder="From"
                onChange={(e) => setSearchOrigin(e.target.value)}
              />
            </PopoverTrigger>
            <Button
              type="button"
              onClick={handleOriginClear}
              variant="ghost"
              className={`absolute right-1 bottom-2 text-gray-500 ${
                searchOrigin ? "flex" : "hidden"
              }`}
            >
              <FontAwesomeIcon icon={faTimesCircle} className="" />
            </Button>
            <PopoverContent>
              <ul className="w-96">
                {locationData.map((location) => (
                  <li key={location?.iataCode}>{location?.name}</li>
                ))}
              </ul>
            </PopoverContent>
          </Popover>
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
            onChange={(e) => setSearchDestination(e.target.value)}
          />
          <Button
            type="button"
            onClick={handleDestinationClear}
            variant="ghost"
            className={`absolute right-1 bottom-2 text-gray-500 ${
              searchDestination ? "flex" : "hidden"
            }`}
          >
            <FontAwesomeIcon icon={faTimesCircle} className="" />
          </Button>
        </div>
      </div>
    </div>
  );
}
