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
import { LocationInput } from "./LocationInput";
import { RoundtripOneWaySelector } from "./RoundtripOneWaySelector";

export const FlightSearchForm = () => {
  const [isRotated, setIsRotated] = useState<boolean>(false);

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

  const swapLocations = () => {
    const prevOrigin = form.getValues("origin");
    const prevDestination = form.getValues("destination");

    form.setValue("origin", prevDestination);
    form.setValue("destination", prevOrigin);

    setIsRotated((prev) => !prev);
  };

  const onSubmit = (data: z.infer<typeof flightSearchSchema>) => {
    console.log("Form Submitted", data);
  };

  return (
    <div className="flex flex-col w-full max-w-[1155px] justify-items-center">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex w-full gap-1 pb-2 ">
            <RoundtripOneWaySelector control={form.control} />

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
