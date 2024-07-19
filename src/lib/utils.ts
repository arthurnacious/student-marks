import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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

export const convertToZARCurrency = (rawAmount: number): string => {
  const amount = rawAmount / 100;

  // Format as ZAR currency
  const formattedAmount = amount.toLocaleString("en-ZA", {
    style: "currency",
    currency: "ZAR",
  });

  return formattedAmount;
};

export const truncateTextByWords = (
  text: string,
  maxLength: number
): string => {
  if (!text) return ""; // Handle empty string gracefully

  const words = text.split(" "); // Split the text into an array of words
  if (words.length <= maxLength) return text; // No truncation needed

  // Truncate to maxLength words and add ellipsis (...)
  return `${words.slice(0, maxLength).join(" ")}...`;
};

export const getEnumKeyByValue = <T extends object, K extends keyof T>(
  enumObj: T,
  value: T[K]
): T[K] | undefined => {
  const key = (Object.keys(enumObj) as Array<K>).find(
    (k) => enumObj[k] === value
  );

  return key ? enumObj[key] : undefined;
};
