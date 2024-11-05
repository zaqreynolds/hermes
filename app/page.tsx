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
  // [key: string]: any; // Add other properties as needed
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
  // [key: string]: any; // Add other properties as needed
}

type LocationType = "origin" | "destination";

export default function Home() {
  const [searchOrigin, setSearchOrigin] = useState<string>("");
  const [searchDestination, setSearchDestination] = useState<string>("");
  const [locationData, setLocationData] = useState<AmadeusLocation[]>([]);
  const [originPopoverOpen, setOriginPopoverOpen] = useState<boolean>(false);
  const [destinationPopoverOpen, setDestinationPopoverOpen] =
    useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const debouncedOrigin = useDebounce(searchOrigin, 500);
  const debouncedDestination = useDebounce(searchDestination, 500);

  useEffect(() => {
    if (!debouncedOrigin && !debouncedDestination) {
      setLocationData([]);
      return;
    }
    const fetchLocations = async (keyword: string): Promise<void> => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/amadeus/locations?keyword=${encodeURIComponent(keyword)}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch locations");
        }

        const data: AmadeusLocation[] = await response.json();
        setLocationData(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : "An error occurred");
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (debouncedOrigin) {
      fetchLocations(debouncedOrigin);
      setOriginPopoverOpen(true);
    }

    if (debouncedDestination) {
      fetchLocations(debouncedDestination);
      setDestinationPopoverOpen(true);
    }
  }, [debouncedOrigin, debouncedDestination]);

  const handleLocationSelect = (
    location: AmadeusLocation,
    type: LocationType
  ): void => {
    if (type === "origin") {
      setSearchOrigin(location.name);
      setOriginPopoverOpen(false);
    } else {
      setSearchDestination(location.name);
      setDestinationPopoverOpen(false);
    }
  };

  const renderLocationList = (type: LocationType): React.ReactNode => (
    <div className="max-h-64 overflow-y-auto">
      {isLoading ? (
        <div className="p-3 text-center text-gray-500">Loading...</div>
      ) : error ? (
        <div className="p-3 text-center text-red-500">{error}</div>
      ) : locationData.length > 0 ? (
        <ul className="divide-y divide-gray-100">
          {locationData.map((location) => (
            <li
              key={location.id}
              className="p-3 hover:bg-gray-50 cursor-pointer"
              onClick={() => handleLocationSelect(location, type)}
            >
              <div className="flex items-center">
                <div>
                  <p className="font-medium">{location.name}</p>
                  <p className="text-sm text-gray-500">
                    {location.address.cityName}, {location.address.countryName}
                  </p>
                </div>
                <span className="ml-auto text-sm text-gray-400">
                  {location.iataCode}
                </span>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="p-3 text-center text-gray-500">No locations found</div>
      )}
    </div>
  );

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Flight Search</h1>

      <div className="space-y-4">
        {/* Origin Input */}
        <div className="relative">
          <Popover open={originPopoverOpen} onOpenChange={setOriginPopoverOpen}>
            <PopoverTrigger asChild>
              <div className="relative">
                <FontAwesomeIcon
                  icon={faPlaneDeparture}
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-700"
                />
                <Input
                  className="w-full h-12 pl-10 pr-10"
                  placeholder="From"
                  value={searchOrigin}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSearchOrigin(e.target.value)
                  }
                />
                {searchOrigin && (
                  <Button
                    type="button"
                    variant="ghost"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                    onClick={() => setSearchOrigin("")}
                  >
                    <FontAwesomeIcon
                      icon={faTimesCircle}
                      className="text-foreground"
                    />
                  </Button>
                )}
              </div>
            </PopoverTrigger>
            <PopoverContent
              className="w-[var(--radix-popover-trigger-width)] p-0"
              sideOffset={4}
              onOpenAutoFocus={(e) => e.preventDefault()}
            >
              {renderLocationList("origin")}
            </PopoverContent>
          </Popover>
        </div>

        {/* Destination Input */}
        <div className="relative">
          <Popover
            open={destinationPopoverOpen}
            onOpenChange={setDestinationPopoverOpen}
          >
            <PopoverTrigger asChild>
              <div className="relative">
                <FontAwesomeIcon
                  icon={faPlaneArrival}
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-700"
                />
                <Input
                  className="w-full h-12 pl-10 pr-10"
                  placeholder="To"
                  value={searchDestination}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSearchDestination(e.target.value)
                  }
                />
                {searchDestination && (
                  <Button
                    type="button"
                    variant="ghost"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                    onClick={() => setSearchDestination("")}
                  >
                    <FontAwesomeIcon
                      icon={faTimesCircle}
                      className="text-foreground"
                    />
                  </Button>
                )}
              </div>
            </PopoverTrigger>
            <PopoverContent
              className="w-[var(--radix-popover-trigger-width)] p-0"
              sideOffset={4}
              onOpenAutoFocus={(e) => e.preventDefault()}
            >
              {renderLocationList("destination")}
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
}
