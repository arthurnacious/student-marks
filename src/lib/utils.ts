import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getPrice = (amount?: number): string => {
  return amount && amount > 0 ? `R ${amount / 100}` : "R 0";
};
