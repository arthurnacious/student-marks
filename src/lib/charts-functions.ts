import { parseISO, getMonth, getYear } from "date-fns";

interface DataItem {
  createdAt: string;
  [key: string]: any; // This allows for other properties that don't matter for our function
}

interface MonthlyCounts {
  [key: string]: number;
}

export const arrangeDataByMonthForYear = (
  data: DataItem[],
  year: number
): MonthlyCounts => {
  // Initialize an object with 12 months
  const monthlyCounts: MonthlyCounts = {
    "01": 0,
    "02": 0,
    "03": 0,
    "04": 0,
    "05": 0,
    "06": 0,
    "07": 0,
    "08": 0,
    "09": 0,
    "10": 0,
    "11": 0,
    "12": 0,
  };

  data.forEach((item) => {
    // Parse the createdAt date
    const date = parseISO(item.createdAt);
    // Check if the year matches the given year
    if (getYear(date) === year) {
      // Get the month index (0 for January, 11 for December) and convert to two-digit string
      const month = (getMonth(date) + 1).toString().padStart(2, "0");
      // Increment the count for the corresponding month
      monthlyCounts[month]++;
    }
  });

  return monthlyCounts;
};
