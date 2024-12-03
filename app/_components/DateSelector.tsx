import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { FormField, FormItem, FormMessage } from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Control } from "react-hook-form";
import { z } from "zod";
import { flightSearchSchema } from "./flightSearchSchema";

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
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-44 h-12 justify-start text-left text-xs"
              >
                <CalendarIcon />
                {field.value ? (
                  format(field.value, "PPP")
                ) : (
                  <span className="opacity-70">Pick a date to depart</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="flex w-auto flex-col p-2">
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={field.onChange}
                fromDate={departureDate || new Date()}
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
  );
};
