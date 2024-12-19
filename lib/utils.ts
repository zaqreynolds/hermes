import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const toPascalCase = (str: string) => {
  if (!str) return "";
  return str.replace(/(\w)(\w*)/g, (_, g1, g2) => {
    return g1.toUpperCase() + g2.toLowerCase();
  });
};
