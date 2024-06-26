import {
  calculateBackgroundColor,
  calculateTotal,
  groupData,
  transformData,
} from "@/lib/marks-functions";
import { cn } from "@/lib/utils";
import { useGetStudentsMarks } from "@/query/student-marks";
import { Loader2 } from "lucide-react";
import React from "react";

interface Props {
  studentId: string;
}

const MarksDisplay: React.FC<Props> = ({ studentId }) => {
  const { data, isLoading } = useGetStudentsMarks(studentId);

  if (isLoading) {
    return <Loader2 className="size-10 animate-spin" />;
  }

  if (!data && !isLoading) {
    return <div>Student has not marks allocation</div>;
  }

  const academiesMap = groupData(data!);
  const academies = transformData(academiesMap);

  return (
    <>
      {academies.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full">
          <div className="text-center">
            <p className="text-2xl"> Student has no marks</p>
          </div>
        </div>
      )}
      {academies.map((academy, idx) => (
        <React.Fragment key={`academy-${idx}`}>
          <h2 className="text-5xl border-b border-slate-500 pb-1 my-2 capitalize">
            {academy.name}
          </h2>
          {academy.courses?.map((course, idx2) => {
            const total = calculateTotal(course.fields);

            return (
              <div className="" key={`course-${idx2}`}>
                <h3 className="text-3xl capitalize">{course.name}</h3>
                <div className="flex gap-2 justify-between">
                  {course.fields.map((field, idx3) => (
                    <div key={`field-${idx3}`}>
                      <span className="capitalize">{field.name}:</span>
                      <span className={"rounded-md px-2"}>
                        {field.marks[0].amount}%
                      </span>
                    </div>
                  ))}
                  <div>
                    <span className="capitalize">TotaL: </span>
                    <span
                      className={cn(
                        calculateBackgroundColor(total),
                        "rounded-md px-2"
                      )}
                    >
                      {total}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </React.Fragment>
      ))}
    </>
  );
};

export default MarksDisplay;
