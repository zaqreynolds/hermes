import { TravelerCategory, Travelers } from "@/app/types";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface TravelerCounterProps {
  category: TravelerCategory;
  travelers: Travelers;
  onChange: (type: keyof Travelers, value: number) => void;
}

export const TravelerCounter = ({
  category,
  travelers,
  onChange,
}: TravelerCounterProps) => {
  const count = travelers[category.type];
  console.log("count", count);

  const handleDecrement = () => {
    if (count > category.min) {
      onChange(category.type, count - 1);
    }
  };

  const handleIncrement = () => {
    if (count < category.max && category.validateAdd(travelers)) {
      onChange(category.type, count + 1);
    }
  };

  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex flex-col">
        <Label className="text-xs font-medium">{category.label}</Label>
        {category.description && (
          <span className="text-2xs text-muted-foreground">
            {category.description}
          </span>
        )}
      </div>
      <div className="flex items-center space-x-1">
        <Button
          onClick={handleDecrement}
          disabled={count <= category.min}
          variant="outline"
          size="sm"
        >
          -
        </Button>
        <span className="w-8 text-center text-xs">{count}</span>
        <Button
          onClick={handleIncrement}
          disabled={!category.validateAdd(travelers) || count >= category.max}
          variant="outline"
          size="sm"
        >
          +
        </Button>
      </div>
    </div>
  );
};
