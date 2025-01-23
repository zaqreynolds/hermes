"use client";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { FormField, FormItem, FormMessage } from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { addDays, format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Control } from "react-hook-form";
import { z } from "zod";
import { flightSearchSchema } from "../flightSearchSchema";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface DateSelectorProps {
  control: Control<z.infer<typeof flightSearchSchema>>;
  name: "departureDate" | "returnDate";
  departureDate?: Date | null;
  returnDate?: Date | null;
}

export const DateSelector = ({
  control,
  name,
  departureDate,
  returnDate,
}: DateSelectorProps) => {
  const [popoverOpen, setPopoverOpen] = useState(false);

  const isMobile = useIsMobile();

  const handleDefaultText = (name: string) => {
    return name === "departureDate"
      ? "Pick a date to depart"
      : "Pick a date to return";
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem>
          <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "h-12 justify-start text-left text-xs",
                  isMobile && "w-[45vw]",
                  !isMobile && "w-[177px]"
                )}
              >
                <CalendarIcon />
                {field.value ? (
                  format(field.value, "PPP")
                ) : (
                  <span className="opacity-70">{handleDefaultText(name)}</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="flex w-auto flex-col p-2">
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={(date) => {
                  field.onChange(date);
                  setTimeout(() => setPopoverOpen(false), 200);
                }}
                fromDate={departureDate || addDays(new Date(), 1)}
                toDate={returnDate || undefined}
                initialFocus
                modifiersClassNames={{
                  today: "bg-muted",
                }}
              />
              <div className="flex justify-end">
                {field.value && (
                  <Button
                    variant="outline"
                    className="w-fit text-xs"
                    onClick={() => field.onChange(null)}
                  >
                    Clear Date
                  </Button>
                )}
              </div>
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
