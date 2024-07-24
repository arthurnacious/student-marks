export interface DataItem {
  month: number;
  count: number;
}

export interface InputData<T> {
  [key: string]: { data: T[] | undefined };
}

export interface TransformedData {
  name: string;
  [key: string]: number | string;
}

export const transformData = <T extends DataItem>(
  inputData: InputData<T> = {}
): TransformedData[] => {
  // Initialize an array with objects representing each month from "Jan" to "Dec"
  const data: TransformedData[] = Array.from({ length: 12 }, (_, index) => {
    const month = (index + 1).toString().padStart(2, "0"); // Format month as "01" to "12"
    const monthName = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ][index];

    // Initialize the result object with month name and zero counts for each key
    const item: TransformedData = { name: monthName };
    for (const key in inputData) {
      item[key] = 0;
    }
    return item;
  });

  // Iterate through each key in inputData (e.g., users, classes)
  for (const key in inputData) {
    inputData[key]?.data?.forEach((item) => {
      const monthIndex = item.month - 1; // Adjust month to zero-based index
      if (monthIndex >= 0 && monthIndex < 12) {
        data[monthIndex][key] =
          (data[monthIndex][key] as number) + (item.count || 0);
      }
    });
  }

  return data;
};
