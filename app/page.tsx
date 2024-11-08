"use client";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";
import { useEffect, useState } from "react";
import {
  faCity,
  faPlaneArrival,
  faPlaneDeparture,
  faPlaneUp,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@/components/ui/button";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
// import { usePathname, useRouter, useSearchParams } from "next/navigation";

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

type TravelDirection = "origin" | "destination";

export default function Home() {
  // const router = useRouter();
  // const pathname = usePathname();
  // const searchParams = useSearchParams();
  const [searchOriginQuery, setSearchOriginQuery] = useState<string>("");
  const [searchDestinationQuery, setSearchDestinationQuery] =
    useState<string>("");
  const [originQueryData, setOriginnQueryData] = useState<AmadeusLocation[]>(
    []
  );
  const [destinationQueryData, setDestinationQueryData] = useState<
    AmadeusLocation[]
  >([]);
  const [selectedOrigin, setSelectedOrigin] = useState<AmadeusLocation | null>(
    null
  );
  const [selectedDestination, setSelectedDestination] =
    useState<AmadeusLocation | null>(null);
  const [originPopoverOpen, setOriginPopoverOpen] = useState<boolean>(false);
  const [destinationPopoverOpen, setDestinationPopoverOpen] =
    useState<boolean>(false);
  const [isLoadingOrigin, setIsLoadingOrigin] = useState<boolean>(false);
  const [isLoadingDestination, setIsLoadingDestination] =
    useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  const debouncedOrigin = useDebounce(searchOriginQuery, 500);
  const debouncedDestination = useDebounce(searchDestinationQuery, 500);

  // const createQueryString = useCallback(
  //   (name: string, value: string) => {
  //     const params = new URLSearchParams(searchParams.toString());
  //     params.set(name, value);

  //     return params.toString();
  //   },
  //   [searchParams]
  // );

  // and then this for the button click
  // router.push(pathname + '?' + createQueryString('key', 'value'));

  useEffect(() => {
    if (!searchOriginQuery) {
      setOriginnQueryData([]);
      setOriginPopoverOpen(false);
    }
    if (!searchDestinationQuery) {
      setDestinationQueryData([]);
      setDestinationPopoverOpen(false);
    }
    if (!debouncedOrigin && !debouncedDestination) {
      setOriginnQueryData([]);
      setDestinationQueryData([]);
      return;
    }

    const fetchLocations = async (
      keyword: string,
      travelDirection: TravelDirection,
      cityCode?: string
    ): Promise<void> => {
      if (
        travelDirection === "origin" &&
        (!selectedOrigin || selectedOrigin.subType === "CITY")
      ) {
        setIsLoadingOrigin(true);
      } else if (
        travelDirection === "destination" &&
        (!selectedDestination || selectedDestination.subType === "CITY")
      ) {
        setIsLoadingDestination(true);
      }
      setError(null);

      try {
        let url = `/api/amadeus/locations?keyword=${encodeURIComponent(
          keyword
        )}`;
        if (cityCode) {
          url += `&cityCode=${encodeURIComponent(cityCode)}`;
        }

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error("Failed to fetch locations");
        }

        const data: AmadeusLocation[] = await response.json();
        if (travelDirection === "origin") {
          setOriginnQueryData(data);
        } else if (travelDirection === "destination") {
          setDestinationQueryData(data);
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : "An error occurred");
        console.error("Error fetching data:", error);
      } finally {
        if (
          travelDirection === "origin" &&
          (!selectedOrigin || selectedOrigin.subType === "CITY")
        ) {
          setIsLoadingOrigin(false);
        } else if (
          travelDirection === "destination" &&
          (!selectedDestination || selectedDestination.subType === "CITY")
        ) {
          setIsLoadingDestination(false);
        }
      }
    };

    if (
      debouncedOrigin &&
      (!selectedOrigin || selectedOrigin.subType === "CITY")
    ) {
      fetchLocations(debouncedOrigin, "origin", selectedOrigin?.iataCode);
      setOriginPopoverOpen(true);
    }

    if (
      debouncedDestination &&
      (!selectedDestination || selectedDestination.subType === "CITY")
    ) {
      fetchLocations(
        debouncedDestination,
        "destination",
        selectedDestination?.iataCode
      );
      setDestinationPopoverOpen(true);
    }
  }, [
    debouncedOrigin,
    debouncedDestination,
    selectedOrigin,
    selectedDestination,
  ]);

  const handleLocationSelect = (
    location: AmadeusLocation,
    travelDirection: TravelDirection
  ): void => {
    if (travelDirection === "origin") {
      if (location.subType === "CITY") {
        setSearchOriginQuery(location.name);
        setOriginPopoverOpen(true);
      } else {
        setSelectedOrigin(location);
        setSearchOriginQuery(location.name);
        setOriginPopoverOpen(false);
      }
    } else {
      if (location.subType === "CITY") {
        setSearchDestinationQuery(location.name);
        setDestinationPopoverOpen(true);
      } else {
        setSelectedDestination(location);
        setSearchDestinationQuery(location.name);
        setDestinationPopoverOpen(false);
      }
    }
  };

  const handleClearInput = (travelDirection: TravelDirection): void => {
    if (travelDirection === "origin") {
      setSearchOriginQuery("");
      setSelectedOrigin(null);
      setOriginnQueryData([]);
      setOriginPopoverOpen(false);
    } else {
      setSearchDestinationQuery("");
      setSelectedDestination(null);
      setDestinationQueryData([]);
      setDestinationPopoverOpen(false);
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent,
    travelDirection: TravelDirection
  ) => {
    const locationData =
      travelDirection === "origin" ? originQueryData : destinationQueryData;

    if (e.key === "ArrowDown") {
      setSelectedIndex((prevIndex) => (prevIndex + 1) % locationData.length);
    } else if (e.key === "ArrowUp") {
      setSelectedIndex(
        (prevIndex) =>
          (prevIndex - 1 + locationData.length) % locationData.length
      );
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      handleLocationSelect(locationData[selectedIndex], travelDirection);
      setSelectedIndex(-1);
    }
  };

  useEffect(() => {
    if (!originPopoverOpen && !destinationPopoverOpen) {
      setSelectedIndex(-1);
    }
  }, [originPopoverOpen, destinationPopoverOpen]);

  const renderLocationList = (
    travelDirection: TravelDirection
  ): React.ReactNode => {
    const locationData =
      travelDirection === "origin" ? originQueryData : destinationQueryData;
    const isLoading =
      travelDirection === "origin" ? isLoadingOrigin : isLoadingDestination;

    return (
      <div className="max-h-96 overflow-y-auto">
        {isLoading ? (
          <div className="p-3 text-center text-gray-500">Loading...</div>
        ) : error ? (
          <div className="p-3 text-center text-red-500">{error}</div>
        ) : locationData.length > 0 ? (
          <ul className="divide-y divide-gray-100">
            {locationData.map((location) => (
              <li
                key={location.id}
                className={`p-3 hover:bg-accent cursor-pointer hover:shadow-lg ${
                  selectedIndex === locationData.indexOf(location)
                    ? "bg-accent"
                    : ""
                }`}
                onClick={() => handleLocationSelect(location, travelDirection)}
              >
                <div className="flex items-center">
                  <div>
                    <p className="font-medium flex items-center">
                      {location.name}
                      <FontAwesomeIcon
                        icon={
                          location.subType === "AIRPORT" ? faPlaneUp : faCity
                        }
                        className="h-3 w-3 pl-2"
                      />
                    </p>
                    <p className="text-sm text-gray-500">
                      {location.address.cityName},{" "}
                      {location.address.countryName}
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
          <div className="p-3 text-center text-gray-500">
            No locations found
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Hermes</h1>
      <h2 className="text-lg font-semibold mb-4">Where are you going?</h2>
      <div className="space-y-4">
        {/* Origin Input */}
        <div className="relative">
          <Popover open={originPopoverOpen} onOpenChange={setOriginPopoverOpen}>
            <PopoverTrigger asChild>
              <div className="relative">
                <FontAwesomeIcon
                  icon={faPlaneDeparture}
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-700 "
                />
                <Input
                  className="w-full h-12 pl-10 pr-10 hover:shadow hover:bg-muted focus:bg-muted"
                  placeholder="From"
                  value={searchOriginQuery}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSearchOriginQuery(e.target.value)
                  }
                  onKeyDown={(e) => handleKeyDown(e, "origin")}
                />
                {searchOriginQuery && (
                  <Button
                    type="button"
                    variant="ghost"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                    onClick={() => handleClearInput("origin")}
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
                  className="w-full h-12 pl-10 pr-10 hover:shadow hover:bg-muted focus:bg-muted"
                  placeholder="To"
                  value={searchDestinationQuery}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSearchDestinationQuery(e.target.value)
                  }
                  onKeyDown={(e) => handleKeyDown(e, "destination")}
                />
                {searchDestinationQuery && (
                  <Button
                    type="button"
                    variant="ghost"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                    onClick={() => handleClearInput("destination")}
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
