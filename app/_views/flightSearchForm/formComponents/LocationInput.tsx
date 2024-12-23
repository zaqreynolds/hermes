"use client";
import React, { useEffect, useState } from "react";
import { AmadeusLocation } from "../../../types";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { LocationList } from "./LocationList";
import { useDebounce } from "@/hooks/useDebounce";
import { useFetchLocation } from "../hooks/useFetchLocation";
import { Control } from "react-hook-form";
import { z } from "zod";
import { flightSearchSchema } from "../flightSearchSchema";
import { FormField, FormItem, FormMessage } from "@/components/ui/form";

interface LocationInputProps {
  placeholder: string;
  icon: React.ReactNode;
  control: Control<z.infer<typeof flightSearchSchema>>;
  name: "origin" | "destination";
  value: AmadeusLocation | undefined;
  isMobile: boolean;
}

export const LocationInput: React.FC<LocationInputProps> = ({
  placeholder,
  icon,
  control,
  name,
  value,
  isMobile,
}) => {
  const [query, setQuery] = useState<string>("");
  const [selectedLocation, setSelectedLocation] =
    useState<AmadeusLocation | null>(null);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  const debouncedQuery = useDebounce(query, 500);

  const { isLoading, error, locationData, fetchLocation, clearLocationData } =
    useFetchLocation();

  useEffect(() => {
    if (debouncedQuery === "") {
      setPopoverOpen(false);
    } else if (debouncedQuery && query && !selectedLocation) {
      fetchLocation(debouncedQuery);
      setPopoverOpen(true);
    }
  }, [debouncedQuery, query, selectedLocation]);

  useEffect(() => {
    if (value) {
      setSelectedLocation(value);
      setQuery(value.name);
    } else {
      setQuery("");
      setSelectedLocation(null);
      setPopoverOpen(false);
      clearLocationData();
    }
  }, [value]);

  const handleLocationSelect = (
    location: AmadeusLocation,
    field: { onChange: (value: AmadeusLocation) => void }
  ): void => {
    setSelectedLocation(location);
    setQuery(location.name);
    setPopoverOpen(false);
    field.onChange(location);
  };

  const handleClearInput = (field: {
    onChange: (value: AmadeusLocation | undefined) => void;
  }) => {
    setQuery("");
    setSelectedLocation(null);
    setPopoverOpen(false);
    clearLocationData();
    field.onChange(undefined);
  };

  const handleKeyDown = (
    e: React.KeyboardEvent,
    field?: { onChange: (value: AmadeusLocation) => void }
  ) => {
    if (e.key === "ArrowDown") {
      setSelectedIndex((prevIndex) => (prevIndex + 1) % locationData.length);
    } else if (e.key === "ArrowUp") {
      setSelectedIndex(
        (prevIndex) =>
          (prevIndex - 1 + locationData.length) % locationData.length
      );
    } else if (e.key === "Enter" && popoverOpen) {
      e.preventDefault();
      if (selectedIndex >= 0 && field) {
        handleLocationSelect(locationData[selectedIndex], field);
      }
      setSelectedIndex(-1);
    } else if (e.key === "Escape") {
      setPopoverOpen(false);
      setSelectedIndex(-1);
    }
  };

  const truncateText = (text: string, maxLength: number): string => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    }
    return text;
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem>
          <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
            <PopoverTrigger asChild>
              <div
                className={cn("relative", isMobile ? "w-full" : "w-[360px]")}
              >
                <span className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-600 z-10">
                  {icon}
                </span>
                <div className="relative">
                  <Input
                    className={cn(
                      "w-full h-12 pl-10 pr-10 hover:shadow hover:bg-accent focus:bg-muted",
                      field.value && "pt-5 pb-1"
                    )}
                    placeholder={placeholder}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, field)}
                  />
                  {field.value && (
                    <div className="absolute left-10 top-1.5 right-10 flex items-center text-[10px] text-muted-foreground">
                      <span className="mr-2 text-xs  text-primary">
                        {field.value.iataCode} -
                      </span>
                      <span>
                        {truncateText(
                          `${field.value.address.cityName}, ${field.value.address.countryName}`,
                          isMobile ? 64 : 34
                        )}
                      </span>
                    </div>
                  )}
                </div>
                {query && (
                  <Button
                    type="button"
                    variant="ghost"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                    onClick={() => handleClearInput(field)}
                  >
                    <FontAwesomeIcon icon={faTimesCircle} />
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
                locationData={locationData}
                error={error}
                isLoading={isLoading}
                handleLocationSelect={(location) => {
                  handleLocationSelect(location, field);
                  field.onChange(location);
                }}
                selectedIndex={selectedIndex}
                onChange={field.onChange}
              />
            </PopoverContent>
          </Popover>
          {fieldState.error && (
            <FormMessage>{fieldState.error.message}</FormMessage>
          )}
        </FormItem>
      )}
    />
  );
};
