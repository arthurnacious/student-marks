export interface InputData {
  users?: { data: { month: string; count: number }[] };
  classes?: { data: { month: string; count: number }[] };
}

export interface TransformedData {
  name: string;
  Users: number;
  Classes: number;
}

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
  users.data.forEach((user) => {
    const monthIndex = parseInt(user.month, 10) - 1; // Adjust month to zero-based index
    data[monthIndex].Users = user.count || 0; // Default to 0 if count is undefined
  });

  // Map class data
  classes.data.forEach((classItem) => {
    const monthIndex = parseInt(classItem.month, 10) - 1; // Adjust month to zero-based index
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

// Example usage:
const inputData: InputData = {
  users: {
    data: [
      { month: "01", count: 3 },
      { month: "06", count: 6 },
      { month: "07", count: 2 },
    ],
  },
  classes: { data: [{ month: "06", count: 1 }] },
};

const data: TransformedData[] = transformData(inputData);
console.log(data);
