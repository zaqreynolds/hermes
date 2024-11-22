import { Button } from "@/components/ui/button";
import { FormField, FormItem } from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { TRAVELER_CATEGORIES } from "./categories";
import { TravelerCounter } from "./TravelerCounter";
import { Control } from "react-hook-form";
import { Travelers } from "@/app/types";
import { z } from "zod";
import { flightSearchSchema } from "../flightSearchSchema";

interface TravelerSelectorProps {
  control: Control<z.infer<typeof flightSearchSchema>>;
  isMobile: boolean;
}

export const TravelerSelector = ({
  control,
  isMobile,
}: TravelerSelectorProps) => {
  const formatTravelersLabel = (travelers: Travelers) => {
    const total = travelers.adults + travelers.children + travelers.infants;

    return `${total} Traveler${total !== 1 ? "s" : ""}`;
  };

  return (
    <FormField
      name="travelers"
      control={control}
      render={({ field }) => (
        <FormItem>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                className={cn(
                  "justify-between text-left text-xs",
                  isMobile ? "w-full" : "w-32s"
                )}
              >
                {formatTravelersLabel(field.value)}
                <ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-52 p-4">
              <div className="space-y-4">
                {TRAVELER_CATEGORIES.map((category) => (
                  <TravelerCounter
                    key={category.type}
                    category={category}
                    travelers={field.value}
                    onChange={(type, value) => {
                      const newValue = { ...field.value, [type]: value };

                      // Special handling for infants when reducing adults
                      if (type === "adults" && value < field.value.adults) {
                        newValue.infants = Math.min(newValue.infants, value);
                      }

                      field.onChange(newValue);
                    }}
                  />
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </FormItem>
      )}
    />
  );
};
