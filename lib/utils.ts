import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const durationFormat = (duration: string) => {
  const [hours, minutes] = duration
    .replace("PT", "")
    .replace("H", " ")
    .replace("M", "")
    .split(" ")
    .map((d) => parseInt(d, 10));

  return `${hours}h ${minutes}m`;
};

export const toPascalCase = (str: string) => {
  return str.replace(/(\w)(\w*)/g, (_, g1, g2) => {
    return g1.toUpperCase() + g2.toLowerCase();
  });
};
