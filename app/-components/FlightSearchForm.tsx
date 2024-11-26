"use client";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  faExchangeAlt,
  faPlaneArrival,
  faPlaneDeparture,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Calendar1Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { AmadeusLocation, TravelDirection } from "../types";
import { useScreenSize } from "@/hooks/useScreenSize";
import { useDebounce } from "@/hooks/useDebounce";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { LocationList } from "./LocationList";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { flightSearchSchema } from "./flightSearchSchema";
import { z } from "zod";
import { TravelerSelector } from "./travelerSelector/TravelerSelector";
import { useFetchLocation } from "./useFetchLocation";

export const FlightSearchForm = () => {
  const [searchOriginQuery, setSearchOriginQuery] = useState<string>("");
  const [searchDestinationQuery, setSearchDestinationQuery] =
    useState<string>("");
  const [selectedOrigin, setSelectedOrigin] = useState<AmadeusLocation | null>(
    null
  );
  const [selectedDestination, setSelectedDestination] =
    useState<AmadeusLocation | null>(null);
  const [originPopoverOpen, setOriginPopoverOpen] = useState<boolean>(false);
  const [destinationPopoverOpen, setDestinationPopoverOpen] =
    useState<boolean>(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [isRotated, setIsRotated] = useState<boolean>(false);

  const { isMobile } = useScreenSize();

  const debouncedOrigin = useDebounce(searchOriginQuery, 500);
  const debouncedDestination = useDebounce(searchDestinationQuery, 500);

  const form = useForm<z.infer<typeof flightSearchSchema>>({
    resolver: zodResolver(flightSearchSchema),
    defaultValues: {
      origin: undefined,
      destination: undefined,
      departureDate: undefined,
      returnDate: undefined,
      travelers: {
        adults: 1,
        children: 0,
        infants: 0,
      },
      travelClass: "",
      nonStop: false,
      oneWay: false,
    },
  });

  const departureDate = form.watch("departureDate");
  const returnDate = form.watch("returnDate");
  const oneWay = form.watch("oneWay");

  const {
    isLoading: isLoadingOrigin,
    error: errorOrigin,
    locationData: originQueryData,
    fetchLocation: fetchOriginLocation,
  } = useFetchLocation();
  const {
    isLoading: isLoadingDestination,
    error: errorDestination,
    locationData: destinationQueryData,
    fetchLocation: fetchDestinationLocation,
  } = useFetchLocation();

  useEffect(() => {
    if (debouncedOrigin === "") {
      setOriginPopoverOpen(false);
    } else if (debouncedOrigin && searchOriginQuery && !selectedOrigin) {
      fetchOriginLocation(debouncedOrigin);
      setOriginPopoverOpen(true);
    }

    if (debouncedDestination === "") {
      setDestinationPopoverOpen(false);
    } else if (
      debouncedDestination &&
      searchDestinationQuery &&
      !selectedDestination
    ) {
      fetchDestinationLocation(debouncedDestination);
      setDestinationPopoverOpen(true);
    }
  }, [debouncedOrigin, debouncedDestination]);

  const handleLocationSelect = (
    location: AmadeusLocation,
    travelDirection: TravelDirection,
    field?: { onChange: (value: string) => void }
  ): void => {
    if (travelDirection === "origin") {
      setSelectedOrigin(location);
      setSearchOriginQuery(location.name);
      setOriginPopoverOpen(false);
      field?.onChange?.(location.iataCode);
    } else if (travelDirection === "destination") {
      setSelectedDestination(location);
      setSearchDestinationQuery(location.name);
      setDestinationPopoverOpen(false);
      field?.onChange?.(location.iataCode);
    }
  };

  const handleClearInput = (travelDirection: TravelDirection): void => {
    if (travelDirection === "origin") {
      setSearchOriginQuery("");
      setSelectedOrigin(null);
      setOriginPopoverOpen(false);
    } else {
      setSearchDestinationQuery("");
      setSelectedDestination(null);
      setDestinationPopoverOpen(false);
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent,
    travelDirection: TravelDirection,
    field?: { onChange: (value: string) => void }
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
    } else if (
      e.key === "Enter" &&
      (originPopoverOpen || destinationPopoverOpen)
    ) {
      e.preventDefault();
      if (selectedIndex >= 0) {
        handleLocationSelect(
          locationData[selectedIndex],
          travelDirection,
          field
        );
        setSelectedIndex(-1);
      }
    } else if (e.key === "Escape") {
      if (travelDirection === "origin") {
        setOriginPopoverOpen(false);
      } else {
        setDestinationPopoverOpen(false);
      }
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

    form.setValue("origin", selectedDestination?.iataCode || "");
    form.setValue("destination", selectedOrigin?.iataCode || "");

    setIsRotated((prev) => !prev);
  };

  const truncateText = (text: string, maxLength: number): string => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    }
    return text;
  };

  const onSubmit = (data: z.infer<typeof flightSearchSchema>) => {
    console.log("Form Submitted", data);
  };

  return (
    <div className="flex flex-col w-full max-w-[1155px] justify-items-center">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex w-full gap-1 pb-2 ">
            {/* Roundtrip vs Oneway toggle */}
            <FormField
              control={form.control}
              name="oneWay"
              render={({ field }) => (
                <FormItem>
                  <Select
                    onValueChange={(value) =>
                      field.onChange(value === "oneWay" ? true : false)
                    }
                    defaultValue="roundtrip"
                  >
                    <FormControl>
                      <SelectTrigger className="w-24 text-xs mr-1 hover:bg-accent">
                        <SelectValue>
                          {field.value ? "One-Way" : "Roundtrip"}
                        </SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="w-24 min-w-fit">
                      <SelectGroup className="w-full">
                        <SelectItem
                          value="roundtrip"
                          className="text-xs  mr-1 pr-1"
                        >
                          Roundtrip
                        </SelectItem>
                        <SelectItem
                          value="oneWay"
                          className="text-xs mr-1 pr-1 "
                        >
                          One-Way
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            {/* Travelers */}

            <TravelerSelector control={form.control} isMobile={isMobile} />

            {/* Flight Class Select */}
            <FormField
              control={form.control}
              name="travelClass"
              render={({ field }) => (
                <FormItem>
                  <Select onValueChange={(value) => field.onChange(value)}>
                    <SelectTrigger
                      className={cn(
                        "text-xs hover:bg-accent",
                        isMobile ? "w-[125px]" : "w-36"
                      )}
                    >
                      <SelectValue placeholder="Flight class" />
                    </SelectTrigger>
                    <SelectContent className="w-36">
                      <SelectGroup>
                        <SelectItem value="economy" className="text-xs  pr-1 ">
                          Economy
                        </SelectItem>
                        <SelectItem
                          value="premiumEconomy"
                          className="text-xs pr-1 "
                        >
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
                </FormItem>
              )}
            />
          </div>
          <div className="relative flex flex-col justify-start pb-2 sm:flex-row gap-1 sm:gap-2">
            {/* Origin Input */}
            <FormField
              control={form.control}
              name="origin"
              render={({ field, fieldState }) => (
                <FormItem>
                  <Popover
                    open={originPopoverOpen}
                    onOpenChange={setOriginPopoverOpen}
                  >
                    <PopoverTrigger asChild>
                      <div
                        className={cn(
                          "relative",
                          isMobile ? "w-full" : "w-[360px]"
                        )}
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
                            onChange={(e) => {
                              setSearchOriginQuery(e.target.value);
                            }}
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
                        error={errorOrigin}
                        isLoading={isLoadingOrigin}
                        handleLocationSelect={(location) =>
                          handleLocationSelect(location, "origin", field)
                        }
                        selectedIndex={selectedIndex}
                      />
                    </PopoverContent>
                  </Popover>
                  {fieldState.error && (
                    <FormMessage>{fieldState.error.message}</FormMessage>
                  )}
                </FormItem>
              )}
            />

            {/* Swap Button */}
            <Button
              type="button"
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
            <FormField
              control={form.control}
              name="destination"
              render={({ field, fieldState }) => (
                <FormItem>
                  <Popover
                    open={destinationPopoverOpen}
                    onOpenChange={setDestinationPopoverOpen}
                  >
                    <PopoverTrigger asChild>
                      <div
                        className={cn(
                          "relative",
                          isMobile ? "w-full" : "w-[360px]"
                        )}
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
                            onChange={(e) => {
                              setSearchDestinationQuery(e.target.value);
                            }}
                            onKeyDown={(e) => handleKeyDown(e, "origin")}
                          />
                          {selectedDestination && (
                            <div className="absolute left-10 top-1.5 right-10 text-[10px] text-muted-foreground">
                              {truncateText(
                                `${
                                  selectedDestination.address.cityName
                                }, ${" "} ${
                                  selectedDestination.address.countryName
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
                        error={errorDestination}
                        isLoading={isLoadingDestination}
                        handleLocationSelect={(location) =>
                          handleLocationSelect(location, "destination", field)
                        }
                        selectedIndex={selectedIndex}
                      />
                    </PopoverContent>
                  </Popover>
                  {fieldState.error && (
                    <FormMessage>{fieldState.error.message}</FormMessage>
                  )}
                </FormItem>
              )}
            />
            <div className="flex w-full gap-2">
              {/* Departure Date Picker*/}
              <FormField
                control={form.control}
                name="departureDate"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-44 h-full justify-start text-left text-xs"
                        >
                          <Calendar1Icon />
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span className="opacity-70">
                              Pick a date to depart
                            </span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        align="start"
                        className="flex w-auto flex-col space-y-2 p-2"
                      >
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          fromDate={new Date()}
                          toDate={returnDate || undefined}
                          initialFocus
                        />
                        <div className="flex justify-end">
                          <Button
                            variant="outline"
                            className="w-fit text-xs"
                            onClick={() => field.onChange(null)}
                          >
                            Clear Date
                          </Button>
                        </div>
                      </PopoverContent>
                    </Popover>
                    {fieldState.error && (
                      <FormMessage>{fieldState.error.message}</FormMessage>
                    )}
                  </FormItem>
                )}
              />

              {/* Return Date Picker*/}
              {!oneWay && (
                <FormField
                  control={form.control}
                  name="returnDate"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-44 h-full justify-start text-left text-xs"
                          >
                            <Calendar1Icon />
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span className="opacity-70">
                                Pick a date to return
                              </span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent
                          align="start"
                          className="flex w-auto flex-col p-2"
                        >
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            fromDate={departureDate || new Date()}
                            initialFocus
                          />
                          <div className="flex justify-end">
                            <Button
                              variant="outline"
                              className="w-fit text-xs"
                              onClick={() => field.onChange(null)}
                            >
                              Clear Date
                            </Button>
                          </div>
                        </PopoverContent>
                      </Popover>
                      {fieldState.error && (
                        <FormMessage>{fieldState.error.message}</FormMessage>
                      )}
                    </FormItem>
                  )}
                />
              )}
            </div>
          </div>
          <div className="flex justify-end">
            <Button className="w-fit" type="submit">
              Search
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default FlightSearchForm;
