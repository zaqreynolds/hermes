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
import React, { useContext, useEffect } from "react";
import { LoaderCircleIcon } from "lucide-react";
import { FlightSearchContext } from "@/context/FlightSearchContext";
import NonStopSwitch from "./formComponents/NonStopSwitch";

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

  const departureDate = form.watch("departureDate");
  const returnDate = form.watch("returnDate");
  const oneWay = form.watch("oneWay");
  const origin = form.watch("origin");
  const destination = form.watch("destination");

  const { setSearchState } = useContext(FlightSearchContext);

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
    };
    await searchFlights(searchParams);
  };
  useEffect(() => {
    if (flights) {
      setSearchState((prev) => ({ ...prev, departureOffers: flights }));
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
    <div className="flex flex-col w-full max-w-[1155px] justify-items-center">
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
          <div className="flex justify-between gap-2">
            {isMobile && (
              <div className="flex">
                <NonStopSwitch control={form.control} />
              </div>
            )}

            <Button
              className="w-20 shadow-md active:shadow-none ml-auto"
              type="submit"
              disabled={loading}
            >
              {handleSearchStatus()}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default FlightSearchForm;
