"use client";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  faExchangeAlt,
  faPlaneArrival,
  faPlaneDeparture,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { Calendar1Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { AmadeusLocation, TravelDirection } from "../types";
import { useScreenSize } from "@/hooks/useScreenSize";
import { useDebounce } from "@/hooks/useDebounce";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { LocationList } from "./LocationList";

export const FlightSearchForm = () => {
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
  const [adults, setAdults] = useState<number>(1);
  const [children, setChildren] = useState<number>(0);
  const [infants, setInfants] = useState<number>(0);
  const [isOneWay, setIsOneWay] = useState<boolean>(false);

  const { isMobile } = useScreenSize();

  const debouncedOrigin = useDebounce(searchOriginQuery, 500);
  const debouncedDestination = useDebounce(searchDestinationQuery, 500);

  const maxTravelers = 9;

  const totalTravelers = adults + children + infants;

  const incrementAdults = () => {
    if (adults + children < maxTravelers) setAdults(adults + 1);
  };
  const decrementAdults = () => {
    if (adults > 1) setAdults(adults - 1);
    if (infants > adults - 1) setInfants(adults - 1);
  };

  const incrementChildren = () => {
    if (adults + children < maxTravelers) setChildren(children + 1);
  };
  const decrementChildren = () => {
    if (children > 0) setChildren(children - 1);
  };

  const incrementInfants = () => {
    if (infants < adults) setInfants(infants + 1);
  };
  const decrementInfants = () => {
    if (infants > 0) setInfants(infants - 1);
  };

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

  return (
    <div className="flex flex-col w-full max-w-[1155px] justify-items-center">
      <div className="flex w-full gap-1 pb-2 ">
        {/* Roundtrip vs Oneway toggle */}

        <Select
          value={isOneWay ? "oneWay" : "roundtrip"}
          onValueChange={(value) => setIsOneWay(value === "oneWay")}
        >
          <SelectTrigger className="w-24 text-xs mr-1 hover:bg-accent">
            <SelectValue>{isOneWay ? "One-Way" : "Roundtrip"}</SelectValue>
          </SelectTrigger>
          <SelectContent className="w-24 min-w-fit">
            <SelectGroup className="w-full">
              <SelectItem value="oneWay" className="text-xs mr-1 pr-1 ">
                One-Way
              </SelectItem>
              <SelectItem value="roundtrip" className="text-xs  mr-1 pr-1">
                Roundtrip
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-44 mr-1 justify-between text-left text-xs"
            >
              {`Travelers: ${totalTravelers} `}
              <ChevronDownIcon className="opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="flex flex-col w-fit p-3 space-y-3 ">
            {/* Adults */}
            <div className="flex items-center justify-between  w-40">
              <Label className="text-xs font-medium ">Adults</Label>
              <div className="flex items-center space-x-2">
                <Button
                  onClick={decrementAdults}
                  disabled={adults <= 1}
                  variant="outline"
                  size="sm"
                >
                  -
                </Button>
                <span className="text-xs">{adults}</span>
                <Button
                  onClick={incrementAdults}
                  disabled={adults + children >= maxTravelers}
                  variant="outline"
                  size="sm"
                >
                  +
                </Button>
              </div>
            </div>

            {/* Children */}
            <div className="flex items-center justify-between w-40">
              <Label className="text-xs font-medium">Children</Label>
              <div className="flex items-center space-x-2">
                <Button
                  onClick={decrementChildren}
                  disabled={children <= 0}
                  variant="outline"
                  size="sm"
                >
                  -
                </Button>
                <span className="text-xs">{children}</span>
                <Button
                  onClick={incrementChildren}
                  disabled={adults + children >= maxTravelers}
                  variant="outline"
                  size="sm"
                >
                  +
                </Button>
              </div>
            </div>

            {/* Infants */}
            <div className="flex items-center justify-between  w-40">
              <Label className="text-xs font-medium">Infants</Label>
              <div className="flex items-center space-x-2">
                <Button
                  onClick={decrementInfants}
                  disabled={infants <= 0}
                  variant="outline"
                  size="sm"
                >
                  -
                </Button>
                <span className="text-xs">{infants}</span>
                <Button
                  onClick={incrementInfants}
                  disabled={infants >= adults}
                  variant="outline"
                  size="sm"
                >
                  +
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Flight Class Select */}
        <Select>
          <SelectTrigger className="w-36 text-xs hover:bg-accent">
            <SelectValue placeholder="Flight class" />
          </SelectTrigger>
          <SelectContent className="w-36">
            <SelectGroup>
              <SelectItem value="economy" className="text-xs  pr-1 ">
                Economy
              </SelectItem>
              <SelectItem value="premiumEconomy" className="text-xs pr-1 ">
                Premium Economy
              </SelectItem>
              <SelectItem value="business" className="text-xs  pr-1 ">
                Business
              </SelectItem>
              <SelectItem value="first" className="text-xs  pr-1 ">
                First
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="relative flex flex-col justify-start pb-2 sm:flex-row gap-1 sm:gap-2">
        {/* Origin Input */}
        <div className="flex w-full justify-start">
          <Popover open={originPopoverOpen} onOpenChange={setOriginPopoverOpen}>
            <PopoverTrigger asChild>
              <div
                className={cn("relative", isMobile ? "w-full" : "w-[360px]")}
              >
                <FontAwesomeIcon
                  icon={faPlaneDeparture}
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-600 z-10"
                />
                <div className="relative">
                  <Input
                    className={cn(
                      "w-full h-12 pl-10 pr-10 hover:shadow hover:bg-accent focus:bg-muted",
                      selectedOrigin && "pt-5 pb-1"
                    )}
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
              <LocationList
                travelDirection="origin"
                locationData={originQueryData}
                error={error}
                isLoading={isLoadingOrigin}
                handleLocationSelect={handleLocationSelect}
                selectedIndex={selectedIndex}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Swap Button */}
        <Button
          onClick={swapLocations}
          variant="outline"
          className="absolute top-[33%] left-[80%] -translate-x-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-lg hover:shadow-md sm:static sm:translate-x-0 sm:translate-y-0 sm:h-12 sm:w-12"
        >
          <FontAwesomeIcon
            icon={faExchangeAlt}
            className={cn(
              "transition-transform duration-300 transform ",
              isMobile ? "rotate-90" : "",
              isRotated ? "rotate-180" : "rotate-0"
            )}
          />
        </Button>

        {/* Destination Input */}
        <div className="flex w-full justify-start">
          <Popover
            open={destinationPopoverOpen}
            onOpenChange={setDestinationPopoverOpen}
          >
            <PopoverTrigger asChild>
              <div
                className={cn("relative", isMobile ? "w-full" : "w-[360px]")}
              >
                <FontAwesomeIcon
                  icon={faPlaneArrival}
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-600 z-10"
                />
                <div className="relative">
                  <Input
                    className={cn(
                      "w-full h-12 pl-10 pr-10 hover:shadow hover:bg-accent focus:bg-muted",
                      selectedDestination && "pt-5 pb-1"
                    )}
                    placeholder="To"
                    value={searchDestinationQuery}
                    onChange={(e) => setSearchDestinationQuery(e.target.value)}
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
              <LocationList
                travelDirection="destination"
                locationData={destinationQueryData}
                error={error}
                isLoading={isLoadingDestination}
                handleLocationSelect={handleLocationSelect}
                selectedIndex={selectedIndex}
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex w-full gap-2">
          {/* Departure Date Picker*/}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-44 h-full justify-start text-left text-xs"
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
                className="w-44 h-full justify-start text-left text-xs"
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
      <div className="flex justify-end">
        <Button className="w-fit ">Search</Button>
      </div>
    </div>
  );
};

export default FlightSearchForm;
