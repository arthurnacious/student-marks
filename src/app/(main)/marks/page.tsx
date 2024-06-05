import PageContainerWrapper from "@/components/page-container-wrapper";
import React from "react";
import { client } from "@/lib/hono";
import { cn } from "@/lib/utils";
interface Props {}

const Page: React.FC<Props> = async () => {
  const userId = "e61dec48-fd2d-4a2c-8e73-4b8fcbc5d032";
  const response = await client.api.marks[":userId"].$get({
    param: { userId },
  });

  const data = await response.json();

  const marksData = groupCourses(data.data);

  console.log(marksData);

  return (
    <PageContainerWrapper title="Marks">
      <div className="w-full h-full border border-neutral-500/50 bg-neutral-800/20 rounded p-8">
        {marksData.map((courseData, idx) => {
          const total = calculateTotal(courseData.fields);

          return (
            <React.Fragment key={`course-${idx}`}>
              <h2 className="text-2xl border-b border-slate-500 pb-1 my-2 capitalize">
                {courseData.course}
              </h2>
              <div className="flex gap-2 justify-between">
                {courseData.fields.map(({ name, amount }, idx) => (
                  <div key={`field-${idx}`}>
                    <span className="capitalize">{name}:</span> {amount}%
                  </div>
                ))}
                <div
                  className={cn(
                    calculateBackgroundColor(total),
                    "rounded-md px-2"
                  )}
                >
                  Total: {total}%
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </PageContainerWrapper>
  );
};

export default Page;

interface Course {
  name: string;
}

interface Field {
  couseId: string;
  name: string;
  total: number;
  amount: number;
  course: Course;
}

interface CourseWithFields {
  course: string;
  fields: Field[];
}

interface Mark {
  amount: number;
  field: Field;
}

interface InputData {
  data: Mark[];
}

function groupCourses(data: Mark[]): CourseWithFields[] {
  const result: {
    [courseName: string]: {
      [fieldName: string]: { amount: number; total: number };
    };
  } = {};

  // Group marks by course name and field name
  data.forEach((entry) => {
    const courseName = entry.field.course.name;
    const fieldName = entry.field.name;
    const amount = entry.amount;
    const total = entry.field.total;

    if (!result[courseName]) {
      result[courseName] = {};
    }

    if (!result[courseName][fieldName]) {
      result[courseName][fieldName] = { amount: 0, total: 0 };
    }

    result[courseName][fieldName].amount += amount;
    result[courseName][fieldName].total += total;
  });

  // Convert the grouped data into the desired format
  const courseWithFields: CourseWithFields[] = Object.entries(result).map(
    ([courseName, fields]) => {
      const fieldsArray = Object.entries(fields).map(
        ([name, { amount, total }]) => ({
          name,
          amount,
          total,
        })
      );
      return { course: courseName, fields: fieldsArray };
    }
  );

  return courseWithFields;
}

function calculateTotal(fields: Field[]): number {
  let totalPercentage = 0;
  let nonZeroFieldsCount = 0;

  fields.forEach((field) => {
    // Check if total is non-zero
    if (field.total !== 0) {
      // Calculate the percentage for each non-zero total and accumulate
      totalPercentage += (field.amount / field.total) * 100;
      nonZeroFieldsCount++;
    }
  });

  // Calculate the average percentage only if there are non-zero total fields
  const averagePercentage =
    nonZeroFieldsCount > 0 ? totalPercentage / nonZeroFieldsCount : 0;

  return averagePercentage;
}

function calculateBackgroundColor(total: number): string {
  if (total < 50) {
    return "bg-red-400/90 text-neutral-950";
  } else if (total > 50 && total < 90) {
    return "bg-teal-400 text-neutral-950";
  } else {
    return "bg-green-400 text-neutral-950";
  }
}
