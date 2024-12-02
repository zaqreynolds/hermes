"use client";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import {
  faPlaneArrival,
  faPlaneDeparture,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Calendar1Icon } from "lucide-react";
import { useScreenSize } from "@/hooks/useScreenSize";
import { format } from "date-fns";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { flightSearchSchema } from "./flightSearchSchema";
import { z } from "zod";
import { TravelerSelector } from "./travelerSelector/TravelerSelector";
import { LocationInput } from "./LocationInput";
import { RoundtripOneWaySelector } from "./RoundtripOneWaySelector";
import { FlightClassSelector } from "./FlightClassSelector";
import { SwapLocationsButton } from "./SwapLocationsButton";

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

  const onSubmit = (data: z.infer<typeof flightSearchSchema>) => {
    console.log("Form Submitted", data);
  };

  console.log("formvalues", form.getValues());
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
