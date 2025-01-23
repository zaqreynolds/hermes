"use client";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  faPlaneArrival,
  faPlaneDeparture,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { flightSearchSchema } from "./flightSearchSchema";
import { z } from "zod";
import { TravelerSelector } from "./formComponents/travelerSelector/TravelerSelector";
import { LocationInput } from "./formComponents/LocationInput";
import { RoundtripOneWaySelector } from "./formComponents/RoundtripOneWaySelector";
import { FlightClassSelector } from "./formComponents/FlightClassSelector";
import { SwapLocationsButton } from "./formComponents/SwapLocationsButton";
import { DateSelector } from "./formComponents/DateSelector";
import { useScreenSize } from "@/hooks/useScreenSize";
import { useSearchFlights } from "./hooks/useSearchFlights";
import React, { useContext, useEffect, useRef, useState } from "react";
import { LoaderCircleIcon } from "lucide-react";
import {
  defaultSearchState,
  FlightSearchContext,
} from "@/context/FlightSearchContext";
import NonStopSwitch from "./formComponents/NonStopSwitch";
import { Separator } from "@/components/ui/separator";
import { FlightOffer } from "amadeus-ts";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronUpIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";

export const FlightSearchForm = () => {
  const { isMobile } = useScreenSize();
  const [hideForm, setHideForm] = useState(false);
  const [isRotated, setIsRotated] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  //push to router function
  const pushToRouterBatch = (params: Record<string, string>) => {
    const query = new URLSearchParams(searchParams.toString());
    Object.entries(params).forEach(([key, value]) => {
      query.set(key, value);
    });
    router.push(`${pathname}?${query.toString()}`);
  };

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

  const { reset } = form;

  const departureDate = form.watch("departureDate");
  const returnDate = form.watch("returnDate");
  const oneWay = form.watch("oneWay");
  const origin = form.watch("origin");
  const destination = form.watch("destination");

  const { searchState, setSearchState, isFlightSearchLoading } =
    useContext(FlightSearchContext);

  const offers: FlightOffer[] = [...searchState.flightOffers];

  const { searchFlights, data: flights } = useSearchFlights();

  const onSubmit = async (data: z.infer<typeof flightSearchSchema>) => {
    const { oneWay, returnDate, ...rest } = data;

    setSearchState((prev) => ({
      ...prev,
      isOneWay: oneWay,
      returnDate: oneWay ? null : returnDate || null,
    }));

    const searchParams = {
      ...rest,
      origin: rest.origin.iataCode,
      destination: rest.destination.iataCode,
      departureDate: rest.departureDate.toISOString(),
      ...(returnDate && !oneWay && { returnDate: returnDate.toISOString() }),
    };

    const buildQueryParams = (data: z.infer<typeof flightSearchSchema>) => {
      const params: Record<string, string> = {
        originIataCode: data.origin.iataCode,
        originName: data.origin.name,
        originCity: data.origin.address.cityName,
        originCountry: data.origin.address.countryName,
        destinationIataCode: data.destination.iataCode,
        destinationName: data.destination.name,
        destinationCity: data.destination.address.cityName,
        destinationCountry: data.destination.address.countryName,
        departureDate: data.departureDate.toISOString().split("T")[0],
        travelers: JSON.stringify(data.travelers),
        travelClass: data.travelClass || "",
        nonStop: data.nonStop.toString(),
        oneWay: data.oneWay.toString(),
      };

      if (!data.oneWay && data.returnDate) {
        params.returnDate = data.returnDate.toISOString().split("T")[0];
      }

      return params;
    };

    const queryParams = buildQueryParams(data);

    // Push all query params at once
    pushToRouterBatch(queryParams);

    await searchFlights(searchParams);
    if (isMobile) {
      setHideForm(true);
      setIsRotated(true);
    }
  };

  const isFirstLoad = useRef(true);
  const hasParams = Array.from(searchParams.keys()).length > 0;

  useEffect(() => {
    // Function to parse query params into form values
    const parseQueryParams = () => {
      if (!hasParams) return null;
      const travelers = searchParams.get("travelers")
        ? JSON.parse(searchParams.get("travelers") || "{}")
        : { adults: 1, children: 0, infants: 0 };

      const formValues = {
        origin: {
          iataCode: searchParams.get("originIataCode") || "",
          name: searchParams.get("originName") || "",
          address: {
            cityName: searchParams.get("originCity") || "",
            countryName: searchParams.get("originCountry") || "",
          },
        },
        destination: {
          iataCode: searchParams.get("destinationIataCode") || "",
          name: searchParams.get("destinationName") || "",
          address: {
            cityName: searchParams.get("destinationCity") || "",
            countryName: searchParams.get("destinationCountry") || "",
          },
        },
        departureDate: searchParams.get("departureDate")
          ? new Date(searchParams.get("departureDate") as string)
          : undefined,
        returnDate: searchParams.get("returnDate")
          ? new Date(searchParams.get("returnDate") as string)
          : undefined,
        travelers,
        travelClass: searchParams.get("travelClass") || "",
        nonStop: searchParams.get("nonStop") === "true",
        oneWay: searchParams.get("oneWay") === "true",
      };

      return formValues;
    };

    if (isFirstLoad.current && hasParams) {
      const parsedValues = parseQueryParams();

      if (parsedValues) {
        reset(parsedValues);
      }

      if (
        parsedValues &&
        parsedValues.origin.iataCode &&
        parsedValues.destination.iataCode
      ) {
        searchFlights({
          ...parsedValues,
          origin: parsedValues.origin.iataCode,
          destination: parsedValues.destination.iataCode,
          departureDate:
            parsedValues.departureDate?.toISOString().split("T")[0] || "",
          returnDate:
            parsedValues.returnDate?.toISOString().split("T")[0] || "",
        });
      }

      isFirstLoad.current = false;
    }
  }, [searchParams, reset, searchFlights, hasParams]);

  useEffect(() => {
    if (flights) {
      setSearchState((prev) => ({
        ...prev,
        rawOffers: flights.rawFlightOffers || [],
        offers: flights.decodedFlightOffers || [], // For display
      }));
    }
  }, [flights, setSearchState]);

  const handleSearchStatus = () => {
    if (isFlightSearchLoading) {
      return <LoaderCircleIcon className="animate-spin h-6 w-6" />;
    } else {
      return "Search";
    }
  };

  const isFormDirty =
    form.formState.isDirty ||
    JSON.stringify(searchState) !== JSON.stringify(defaultSearchState);

  return (
    <div
      className={cn(
        "flex flex-col lg:max-w-[1155px] mx-auto ",
        isMobile && "min-w-[92vw] "
      )}
    >
      <div className="flex w-full justify-between items-center">
        <h2 className="text-xl font-semibold mb-4">Where are you going?</h2>
        {isMobile && (
          <Button
            variant="ghost"
            className="[&_svg]:w-6 [&_svg]:h-6"
            onClick={() => {
              setIsRotated(!isRotated);
              setHideForm(!hideForm);
            }}
          >
            <ChevronUpIcon
              className={cn(
                "transform transition-transform rotate-180 duration-500",
                isRotated && "rotate-0 "
              )}
            />
          </Button>
        )}
      </div>

      {!hideForm && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex w-full gap-2 pb-2">
              <RoundtripOneWaySelector
                control={form.control}
                isMobile={isMobile}
              />

              <TravelerSelector control={form.control} isMobile={isMobile} />

              <FlightClassSelector control={form.control} isMobile={isMobile} />
              {!isMobile && (
                <>
                  <div className={" flex-1"} />
                  <NonStopSwitch control={form.control} />
                </>
              )}
            </div>
            <div className="relative flex flex-col justify-start pb-2 sm:flex-row gap-1 sm:gap-2">
              <LocationInput
                control={form.control}
                name="origin"
                placeholder="From"
                icon={
                  <FontAwesomeIcon
                    icon={faPlaneDeparture}
                    className="h-5 w-5 text-stone-600"
                  />
                }
                value={origin}
                isMobile={isMobile}
              />

              <SwapLocationsButton
                setValue={form.setValue}
                getValues={form.getValues}
                isMobile={isMobile}
              />

              <LocationInput
                control={form.control}
                name="destination"
                placeholder="To"
                icon={
                  <FontAwesomeIcon
                    icon={faPlaneArrival}
                    className="h-5 w-5 text-stone-600"
                  />
                }
                value={destination}
                isMobile={isMobile}
              />
              <div className="flex w-full justify-between">
                <DateSelector
                  control={form.control}
                  name="departureDate"
                  returnDate={returnDate}
                />

                {!oneWay && (
                  <DateSelector
                    control={form.control}
                    name="returnDate"
                    departureDate={departureDate}
                  />
                )}
              </div>
            </div>
            <div className="flex justify-end items-center space-x-2">
              {isMobile && (
                <div className="flex mr-auto mt-[-20px]">
                  <NonStopSwitch control={form.control} />
                </div>
              )}
              {isFormDirty && (
                <Button
                  variant="outline"
                  className="w-24 shadow-md border border-primary mt-4 active:shadow-none"
                  onClick={() => {
                    router.push("/");
                    setSearchState(defaultSearchState);
                    form.reset({
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
                    });
                  }}
                >
                  Clear Search
                </Button>
              )}

              <Button
                className="w-20 shadow-md mt-4 active:shadow-none"
                type="submit"
                disabled={isFlightSearchLoading}
              >
                {handleSearchStatus()}
              </Button>
            </div>
          </form>
        </Form>
      )}
      <Separator className="bg-accent my-2" />
      {!offers.length && !isFlightSearchLoading && (
        <div className="flex flex-col items-center flex-grow w-full overflow-hidden">
          <h2 className="flex text-lg font-semibold text-center mb-4">
            Search for flights above to get started...
          </h2>
        </div>
      )}
    </div>
  );
};

export default FlightSearchForm;
