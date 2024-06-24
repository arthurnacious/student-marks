export type Mark = {
  id: string;
  fieldId: string;
  studentId: string;
  amount: number;
};

type Field = {
  name: string;
  total: number;
  marks: Mark[];
};

type Course = {
  name: string;
  fields: Field[];
};

type Academy = {
  name: string;
  courses: Course[] | null;
};

type FetchedData = {
  id: string;
  studentId: string;
  classId: string;
  class: {
    course: {
      name: string;
      academy: { name: string } | null;
      fields: {
        total: number;
        name: string;
        marks: Mark[];
      }[];
    };
  };
};

// Grouping function
// Grouping function
export const groupData = (data: FetchedData[]): Map<string, Academy> => {
  const academiesMap = new Map<string, Academy>();

  data.forEach(({ class: { course, ...rest } }) => {
    const academyName = course.academy?.name || "Unknown Academy";
    const courseName = course.name;

    let academy = academiesMap.get(academyName);
    if (!academy) {
      academy = { name: academyName, courses: [] };
      academiesMap.set(academyName, academy);
    }

    let courseObj = academy.courses?.find((c) => c.name === courseName);
    if (!courseObj) {
      courseObj = { name: courseName, fields: [] };
      academy.courses?.push(courseObj);
    }

    course.fields.forEach(({ name, total, marks }) => {
      const fieldMarks = marks.length > 0 ? [marks[0]] : []; // Only take the first mark for each field
      const field: Field = { name, total, marks: fieldMarks };
      courseObj!.fields.push(field);
    });
  });

  return academiesMap;
};

// Transformation function
export const transformData = (
  academiesMap: Map<string, Academy>
): Academy[] => {
  return Array.from(academiesMap.values());
};

export const calculateTotal = (fields: Field[]): number => {
  let totalPercentage = 0;
  let totalFields = 0;

  fields.forEach((field) => {
    if (field.marks.length > 0) {
      const mark = field.marks[0]; // Only consider the first mark for each field
      const percentage = (mark.amount / field.total) * 100; // Calculate the percentage for this mark
      totalPercentage += percentage;
      totalFields++;
    }
  });

  if (totalFields === 0) return 0;

  // Calculate the average percentage
  const averagePercentage = Math.round(totalPercentage / totalFields);

  return averagePercentage;
};

export const calculateBackgroundColor = (total: number): string => {
  if (total < 50) {
    return "bg-red-400/90 text-neutral-950";
  } else if (total > 50 && total < 90) {
    return "bg-teal-400 text-neutral-950";
  } else {
    return "bg-green-400 text-neutral-950";
  }
};
