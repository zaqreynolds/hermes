"use client";
import React, { useEffect, useState } from "react";
import { AmadeusLocation } from "../types";
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
import { useScreenSize } from "@/hooks/useScreenSize";
import { useDebounce } from "@/hooks/useDebounce";
import { useFetchLocation } from "./useFetchLocation";

interface LocationInputProps {
  onSelect: (location: AmadeusLocation) => void;
  placeholder: string;
  icon: React.ReactNode;
  location: AmadeusLocation | null;
}

export const LocationInput: React.FC<LocationInputProps> = ({
  onSelect,
  placeholder,
  icon,
  location,
}) => {
  const [query, setQuery] = useState<string>(location?.name || "");
  const [selectedLocation, setSelectedLocation] =
    useState<AmadeusLocation | null>(null);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  const { isMobile } = useScreenSize();

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
  }, [debouncedQuery]);

  useEffect(() => {
    setQuery(location?.name || "");
    setSelectedLocation(location);
  }, [location]);

  const handleLocationSelect = (location: AmadeusLocation): void => {
    setSelectedLocation(location);
    setQuery(location.name);
    setPopoverOpen(false);
    onSelect(location);
  };

  const handleClearInput = () => {
    setQuery("");
    setSelectedLocation(null);
    setPopoverOpen(false);
    clearLocationData();
  };

  const handleKeyDown = (
    e: React.KeyboardEvent,
    field?: { onChange: (value: string) => void }
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
      if (selectedIndex >= 0) {
        handleLocationSelect(locationData[selectedIndex], field);
        setSelectedIndex(-1);
      }
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
    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
      <PopoverTrigger asChild>
        <div className={cn("relative", isMobile ? "w-full" : "w-[360px]")}>
          <span className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-600 z-10">
            {icon}
          </span>
          <div className="relative">
            <Input
              className={cn(
                "w-full h-12 pl-10 pr-10 hover:shadow hover:bg-accent focus:bg-muted",
                selectedLocation && "pt-5 pb-1"
              )}
              placeholder={placeholder}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e)}
            />
            {selectedLocation && (
              <div className="absolute left-10 top-1.5 right-10 text-[10px] text-muted-foreground">
                {truncateText(
                  `${selectedLocation.address.cityName}, ${" "} ${
                    selectedLocation.address.countryName
                  }`,
                  isMobile ? 64 : 34
                )}
              </div>
            )}
          </div>
          {query && (
            <Button
              type="button"
              variant="ghost"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
              onClick={handleClearInput}
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
          handleLocationSelect={handleLocationSelect}
          selectedIndex={selectedIndex}
        />
      </PopoverContent>
    </Popover>
  );
};
