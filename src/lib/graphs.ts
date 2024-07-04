export interface InputData {
  users?: { data: { month: number; count: number }[] | undefined };
  classes?: { data: { month: number; count: number }[] | undefined };
}

export interface TransformedData {
  name: string;
  Users: number;
  Classes: number;
}

const convertMonthNumberToString = (monthNumber: string): string => {
  const months: string[] = [
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
  ];

  // Convert "01" to 1 and subtract 1 to adjust for zero-based indexing
  const index = parseInt(monthNumber, 10) - 1;

  return months[index] || ""; // Return month name or empty string if index is out of range
};

export const transformData = (inputData: InputData = {}): TransformedData[] => {
  const { users = { data: [] }, classes = { data: [] } } = inputData;

  // Initialize an array with objects representing each month from "Jan" to "Dec"
  const data: TransformedData[] = Array.from({ length: 12 }, (_, index) => {
    const month = (index + 1).toString().padStart(2, "0"); // Format month as "01" to "12"
    return {
      name: month, // Example: "01" for January
      Users: 0,
      Classes: 0,
    };
  });

  // Map user data
  users.data?.forEach((user) => {
    const monthIndex = user.month - 1; // Adjust month to zero-based index
    data[monthIndex].Users = user.count || 0; // Default to 0 if count is undefined
  });

  // Map class data
  classes.data?.forEach((classItem) => {
    const monthIndex = classItem.month - 1; // Adjust month to zero-based index
    data[monthIndex].Classes = classItem.count || 0; // Default to 0 if count is undefined
  });

  // Map month names
  const monthNames: string[] = [
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
  ];

  // Transform data to have month names instead of numbers
  const transformedData: TransformedData[] = data.map((item) => ({
    name: monthNames[parseInt(item.name, 10) - 1], // Get month name from array
    Users: item.Users,
    Classes: item.Classes,
  }));

  return transformedData;
};
