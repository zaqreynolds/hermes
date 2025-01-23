"use client";
import { Control } from "react-hook-form";
import { z } from "zod";
import { flightSearchSchema } from "../flightSearchSchema";
import { FormField, FormItem } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface FlightClassSelectorProps {
  control: Control<z.infer<typeof flightSearchSchema>>;
  isMobile: boolean;
}

export const FlightClassSelector = ({
  control,
  isMobile,
}: FlightClassSelectorProps) => {
  return (
    <FormField
      control={control}
      name="travelClass"
      render={({ field }) => (
        <FormItem>
          <Select
            value={field.value || ""}
            onValueChange={(value) => field.onChange(value)}
          >
            <SelectTrigger
              className={cn(
                "text-xs hover:bg-accent",
                isMobile ? "w-full " : "w-36"
              )}
            >
              <SelectValue placeholder="Flight class" />
            </SelectTrigger>
            <SelectContent className="w-36">
              <SelectGroup>
                <SelectItem value="ECONOMY" className="text-xs  pr-1 ">
                  Economy
                </SelectItem>
                <SelectItem value="PREMIUM_ECONOMY" className="text-xs pr-1 ">
                  Premium Economy
                </SelectItem>
                <SelectItem value="BUSINESS" className="text-xs  pr-1 ">
                  Business
                </SelectItem>
                <SelectItem value="FIRST" className="text-xs  pr-1 ">
                  First
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </FormItem>
      )}
    />
  );
};
