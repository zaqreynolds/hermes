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
import { TravelerSelector } from "./travelerSelector/TravelerSelector";
import { LocationInput } from "./LocationInput";
import { RoundtripOneWaySelector } from "./RoundtripOneWaySelector";
import { FlightClassSelector } from "./FlightClassSelector";
import { SwapLocationsButton } from "./SwapLocationsButton";
import { DateSelector } from "./DateSelector";
import { useScreenSize } from "@/hooks/useScreenSize";
import { useSearchFlights } from "./useSearchFlights";
import { useEffect } from "react";

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

  const {
    searchFlights,
    data: flights,
    // loading, error
  } = useSearchFlights();

  const onSubmit = async (data: z.infer<typeof flightSearchSchema>) => {
    await searchFlights(data);
  };
  useEffect(() => {
    if (flights) {
      console.log("Updated flights data:", flights);
    }
  }, [flights]);
  return (
    <div className="flex flex-col w-full max-w-[1155px] justify-items-center">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex w-full gap-1 pb-2 ">
            <RoundtripOneWaySelector control={form.control} />

            <TravelerSelector control={form.control} isMobile={isMobile} />

            <FlightClassSelector control={form.control} isMobile={isMobile} />
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
