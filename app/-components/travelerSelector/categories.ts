import { TravelerCategory } from "@/app/types";

export const TRAVELER_CATEGORIES: TravelerCategory[] = [
  {
    label: "Adults",
    type: "adults",
    description: "Age 12+",
    min: 1,
    max: 9,
    validateAdd: (travelers) => travelers.adults + travelers.children < 9,
  },
  {
    label: "Children",
    type: "children",
    description: "Age 2-11",
    min: 0,
    max: 8,
    validateAdd: (travelers) => travelers.adults + travelers.children < 9,
  },
  {
    label: "Infants",
    type: "infants",
    description: "Under 2",
    min: 0,
    max: 4,
    validateAdd: (travelers) => travelers.infants < travelers.adults,
  },
];
