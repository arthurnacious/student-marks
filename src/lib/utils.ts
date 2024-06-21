import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getPrice = (amount?: number): string => {
  return amount && amount > 0 ? `R ${amount / 100}` : "R 0";
};

export const makeInitials = (name: string): string => {
  // Split the name by spaces into an array of words
  const words = name.trim().split(/\s+/);

  // Map over the words, taking the first letter of each word and converting it to uppercase
  const initials = words.map((word) => word[0].toUpperCase()).join("");

  return initials;
};

export const toTitleCase = (str: string): string => {
  return str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
};
