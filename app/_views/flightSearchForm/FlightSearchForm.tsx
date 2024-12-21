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
import React, { Suspense, useContext, useEffect } from "react";
import { LoaderCircleIcon } from "lucide-react";
import {
  defaultSearchState,
  FlightSearchContext,
} from "@/context/FlightSearchContext";
import NonStopSwitch from "./formComponents/NonStopSwitch";
import { FlightSearchResults } from "../flightSearchResults/FlightSearchResults";
import { Separator } from "@/components/ui/separator";
import { FlightOffer } from "amadeus-ts";
import Pricing from "../pricing/Pricing";

export const FlightSearchForm = () => {
  const { isMobile } = useScreenSize();

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

  const {
    formState: { isDirty },
    reset,
  } = form;

  const departureDate = form.watch("departureDate");
  const returnDate = form.watch("returnDate");
  const oneWay = form.watch("oneWay");
  const origin = form.watch("origin");
  const destination = form.watch("destination");

  const { searchState, setSearchState } = useContext(FlightSearchContext);
  const offers: FlightOffer[] = [
    ...searchState.departureOffers,
    ...searchState.returnOffers,
  ];

  const {
    searchFlights,
    data: flights,
    loading,
    // error
  } = useSearchFlights();

  const onSubmit = async (data: z.infer<typeof flightSearchSchema>) => {
    const { oneWay, returnDate, ...rest } = data;

    setSearchState((prev) => ({
      ...prev,
      isOneWay: oneWay,
      returnDate: oneWay ? null : returnDate,
    }));

    const searchParams = {
      ...rest,
      origin: rest.origin.address.cityCode,
      destination: rest.destination.address.cityCode,
      departureDate: rest.departureDate.toISOString(),
      ...(returnDate && !oneWay && { returnDate: returnDate.toISOString() }),
    };

    await searchFlights(searchParams);
  };

  useEffect(() => {
    if (flights) {
      setSearchState((prev) => ({
        ...prev,
        departureOffers: flights.departureOffers || [],
        returnOffers: flights.returnOffers || [],
      }));
    }
  }, [flights, setSearchState]);

  const handleSearchStatus = () => {
    if (loading) {
      return <LoaderCircleIcon className="animate-spin h-6 w-6" />;
    } else {
      return "Search";
    }
  };

  return (
    <div className="flex flex-col w-full max-w-[1155px] h-full justify-items-center ">
      <h2 className="text-lg font-semibold mb-4">Where are you going?</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex w-full gap-1 pb-2 pr-1">
            <RoundtripOneWaySelector control={form.control} />

            <TravelerSelector control={form.control} isMobile={isMobile} />

            <FlightClassSelector control={form.control} isMobile={isMobile} />
            <div className=" flex-1" />
            {!isMobile && <NonStopSwitch control={form.control} />}
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
            <div className="flex w-full gap-2">
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
          <div className="flex justify-end items-center space-x-2 mt-4">
            {isMobile && (
              <div className="flex">
                <NonStopSwitch control={form.control} />
              </div>
            )}
            {isDirty && (
              <Button
                variant="outline"
                className="w-24 shadow-md border border-primary active:shadow-none"
                onClick={() => {
                  reset();
                  setSearchState(defaultSearchState);
                }}
              >
                Clear Search
              </Button>
            )}

            <Button
              className="w-20 shadow-md active:shadow-none"
              type="submit"
              disabled={loading}
            >
              {handleSearchStatus()}
            </Button>
          </div>
        </form>
      </Form>
      <Separator className="bg-accent my-2" />
      <div className="flex flex-col items-center flex-grow w-full h-screen overflow-hidden">
        {!offers.length && !loading && (
          <h2 className="flex text-lg font-semibold text-center mb-4">
            Search for flights above to get started...
          </h2>
        )}
        <div className="flex w-full overflow-hidden">
          <Suspense fallback={<div>Loading Flight Search Results...</div>}>
            <FlightSearchResults loading={loading} />
          </Suspense>
          <Suspense fallback={<div>Loading Pricing and Analysis...</div>}>
            <Pricing />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default FlightSearchForm;
