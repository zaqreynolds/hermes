"use client";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";
import { useEffect, useState } from "react";
import {
  faCity,
  faExchangeAlt,
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
import { useScreenSize } from "@/hooks/useScreenSize";
import { cn } from "@/lib/utils";
import { Calendar1Icon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
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
  const [originQueryData, setOriginQueryData] = useState<AmadeusLocation[]>([]);
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
  const [isRotated, setIsRotated] = useState<boolean>(false);
  const [departureDate, setDepartureDate] = useState<Date | null>(null);
  const [returnDate, setReturnDate] = useState<Date | null>(null);

  const { isMobile } = useScreenSize();

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

  const fetchLocations = async (
    keyword: string,
    travelDirection: TravelDirection
  ): Promise<void> => {
    if (travelDirection === "origin") {
      setIsLoadingOrigin(true);
    } else {
      setIsLoadingDestination(true);
    }
    setError(null);

    try {
      const response = await fetch(
        `/api/amadeus/locations?keyword=${encodeURIComponent(keyword)}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch locations");
      }

      const data: AmadeusLocation[] = await response.json();
      if (travelDirection === "origin") {
        console.log("Setting originQueryData:", data);
        setOriginQueryData(data);
      } else {
        setDestinationQueryData(data);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
      console.error("Error fetching data:", error);
    } finally {
      if (travelDirection === "origin") {
        setIsLoadingOrigin(false);
      } else {
        setIsLoadingDestination(false);
      }
    }
  };

  useEffect(() => {
    if (debouncedOrigin === "") {
      setOriginQueryData([]);
      setOriginPopoverOpen(false);
    } else if (debouncedOrigin && searchOriginQuery && !selectedOrigin) {
      fetchLocations(debouncedOrigin, "origin");
      setOriginPopoverOpen(true);
    }

    if (debouncedDestination === "") {
      setDestinationQueryData([]);
      setDestinationPopoverOpen(false);
    } else if (
      debouncedDestination &&
      searchDestinationQuery &&
      !selectedDestination
    ) {
      fetchLocations(debouncedDestination, "destination");
      setDestinationPopoverOpen(true);
    }
  }, [
    debouncedOrigin,
    debouncedDestination,
    JSON.stringify(selectedOrigin),
    JSON.stringify(selectedDestination),
  ]);

  const handleLocationSelect = (
    location: AmadeusLocation,
    travelDirection: TravelDirection
  ): void => {
    if (travelDirection === "origin") {
      setSelectedOrigin(location);
      setSearchOriginQuery(location.name);
      setOriginPopoverOpen(false);
    } else {
      setSelectedDestination(location);
      setSearchDestinationQuery(location.name);
      setDestinationPopoverOpen(false);
    }
  };

  const handleClearInput = (travelDirection: TravelDirection): void => {
    if (travelDirection === "origin") {
      setSearchOriginQuery("");
      setSelectedOrigin(null);
      setOriginQueryData([]);
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

  const swapLocations = () => {
    setSelectedOrigin((prevOrigin) => {
      setSelectedDestination(prevOrigin);
      return selectedDestination;
    });

    setSearchOriginQuery((prevQuery) => {
      setSearchDestinationQuery(prevQuery);
      return searchDestinationQuery;
    });
    setIsRotated((prev) => !prev);
  };

  const truncateText = (text: string, maxLength: number): string => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    }
    return text;
  };

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

  console.log("Selected Origin:", selectedOrigin);
  console.log("Selected Destination:", selectedDestination);

  return (
    <div className="w-full flex flex-col p-4 overflow-auto">
      <h1 className="text-2xl font-bold mb-6">Hermes</h1>
      <h2 className="text-lg font-semibold mb-4">Where are you going?</h2>
      <div className="flex flex-col">
        <div className="relative flex flex-col justify-center pb-2 sm:flex-row gap-4 sm:gap-2">
          {/* Origin Input */}
          <div className="flex w-full flex-1 justify-end">
            <Popover
              open={originPopoverOpen}
              onOpenChange={setOriginPopoverOpen}
            >
              <PopoverTrigger asChild>
                <div className="relative w-full max-w-[358px]">
                  <FontAwesomeIcon
                    icon={faPlaneDeparture}
                    className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-700 z-10"
                  />
                  <div className="relative">
                    <Input
                      className={`w-full h-12 pl-10 pr-10 hover:shadow hover:bg-accent focus:bg-muted ${
                        selectedOrigin ? `pt-5 pb-1` : ""
                      }`}
                      placeholder="From"
                      value={searchOriginQuery}
                      onChange={(e) => setSearchOriginQuery(e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, "origin")}
                    />
                    {selectedOrigin && (
                      <div className="absolute left-10 top-1.5 right-10 text-[10px] text-muted-foreground">
                        {truncateText(
                          `${selectedOrigin.address.cityName}, ${" "} ${
                            selectedOrigin.address.countryName
                          }`,
                          isMobile ? 64 : 34
                        )}
                      </div>
                    )}
                  </div>
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

          {/* Swap Button */}
          <Button
            onClick={swapLocations}
            variant="outline"
            className="absolute top-[50%] left-[80%] -translate-x-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-lg hover:shadow-md sm:static sm:translate-x-0 sm:translate-y-0 sm:h-12 sm:w-12"
          >
            <FontAwesomeIcon
              icon={faExchangeAlt}
              className={`transition-transform duration-300 transform ${
                isRotated ? "rotate-180" : "rotate-0"
              }`}
            />
          </Button>

          {/* Destination Input */}
          <div className="flex w-full flex-1 justify-start">
            <Popover
              open={destinationPopoverOpen}
              onOpenChange={setDestinationPopoverOpen}
            >
              <PopoverTrigger asChild>
                <div className="relative w-full max-w-[358px]">
                  <FontAwesomeIcon
                    icon={faPlaneArrival}
                    className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-700 z-10"
                  />
                  <div className="relative">
                    <Input
                      className={`w-full h-12 pl-10 pr-10 hover:shadow hover:bg-accent focus:bg-muted ${
                        selectedDestination ? `pt-5 pb-1` : ""
                      }`}
                      placeholder="To"
                      value={searchDestinationQuery}
                      onChange={(e) =>
                        setSearchDestinationQuery(e.target.value)
                      }
                      onKeyDown={(e) => handleKeyDown(e, "destination")}
                    />
                    {selectedDestination && (
                      <div className="absolute left-10 top-1.5 right-10 text-[10px] text-muted-foreground">
                        {truncateText(
                          `${selectedDestination.address.cityName}, ${" "} ${
                            selectedDestination.address.countryName
                          }`,
                          isMobile ? 64 : 34
                        )}
                      </div>
                    )}
                  </div>
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
        <div className="flex w-full justify-around">
          {/* Departure Date Picker*/}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-44 justify-start text-left text-xs"
              >
                <Calendar1Icon />
                {departureDate ? (
                  format(departureDate, "PPP")
                ) : (
                  <span className="opacity-70">Pick a date to depart</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align="start"
              className="flex w-auto flex-col space-y-2 p-2"
            >
              <Calendar
                mode="single"
                selected={departureDate ?? undefined}
                onSelect={(day) => setDepartureDate(day ?? null)}
                fromDate={new Date()}
                toDate={returnDate ?? undefined}
                initialFocus
              />
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  className="w-fit text-xs"
                  onClick={() => setDepartureDate(null)}
                >
                  Clear Date
                </Button>
              </div>
            </PopoverContent>
          </Popover>
          {/* Return Date Picker*/}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-44 justify-start text-left text-xs"
              >
                <Calendar1Icon />
                {returnDate ? (
                  format(returnDate, "PPP")
                ) : (
                  <span className="opacity-70">Pick a date to return</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="flex w-auto flex-col p-2">
              <Calendar
                mode="single"
                selected={returnDate ?? undefined}
                onSelect={(day) => setReturnDate(day ?? null)}
                fromDate={departureDate ?? new Date()}
                initialFocus
              />
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  className="w-fit text-xs"
                  onClick={() => setReturnDate(null)}
                >
                  Clear Date
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
}
