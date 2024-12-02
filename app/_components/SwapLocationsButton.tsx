"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { faExchangeAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { z } from "zod";
import { UseFormGetValues, UseFormSetValue } from "react-hook-form";
import { cn } from "@/lib/utils";

interface SwapLocationsButtonProps {
  setValue: UseFormSetValue<z.infer<typeof flightSearchSchema>>;
  getValues: UseFormGetValues<z.infer<typeof flightSearchSchema>>;
  isMobile: boolean;
}
export const SwapLocationsButton = ({
  setValue,
  getValues,
  isMobile,
}: SwapLocationsButtonProps) => {
  const [isRotated, setIsRotated] = useState<boolean>(false);

  const swapLocations = () => {
    const prevOrigin = getValues("origin");
    const prevDestination = getValues("destination");

    setValue("origin", prevDestination);
    setValue("destination", prevOrigin);

    setIsRotated((prev) => !prev);
  };

  return (
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
  );
};
