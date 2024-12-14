import { FormField, FormItem } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Control } from "react-hook-form";
import { flightSearchSchema } from "./flightSearchSchema";
import { z } from "zod";

interface NonStopSwitchProps {
  control: Control<z.infer<typeof flightSearchSchema>>;
}

const NonStopSwitch = ({ control }: NonStopSwitchProps) => {
  return (
    <FormField
      control={control}
      name="nonStop"
      render={({ field }) => (
        <FormItem className="flex">
          <div className="flex items-center space-x-2">
            <Switch
              id="nonStop"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
            <Label className="mt-0">Nonstop</Label>
          </div>
        </FormItem>
      )}
    />
  );
};

export default NonStopSwitch;
