import { Control } from "react-hook-form";
import { z } from "zod";
import { flightSearchSchema } from "./flightSearchSchema";
import { FormControl, FormField, FormItem } from "@/components/ui/form";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const RoundtripOneWaySelector = ({
  control,
}: {
  control: Control<z.infer<typeof flightSearchSchema>>;
}) => {
  return (
    <FormField
      control={control}
      name="oneWay"
      render={({ field }) => (
        <FormItem>
          <Select
            onValueChange={(value) =>
              field.onChange(value === "oneWay" ? true : false)
            }
            defaultValue="roundtrip"
          >
            <FormControl>
              <SelectTrigger className="w-24 text-xs mr-1 hover:bg-accent">
                <SelectValue>
                  {field.value ? "One-Way" : "Roundtrip"}
                </SelectValue>
              </SelectTrigger>
            </FormControl>
            <SelectContent className="w-24 min-w-fit">
              <SelectGroup className="w-full">
                <SelectItem value="roundtrip" className="text-xs  mr-1 pr-1">
                  Roundtrip
                </SelectItem>
                <SelectItem value="oneWay" className="text-xs mr-1 pr-1 ">
                  One-Way
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </FormItem>
      )}
    />
  );
};
