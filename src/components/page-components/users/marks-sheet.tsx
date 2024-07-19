import React, { FC } from "react";
import {
  calculateBackgroundColor,
  calculateTotal,
} from "@/lib/marks-functions";
import { cn } from "@/lib/utils";
import { Department } from "@/lib/marks-functions";

interface Props {
  departments: Department[];
}

const MarksSheet: FC<Props> = ({ departments }) => {
  return departments.map((department, idx) => (
    <React.Fragment key={`department-${idx}`}>
      <h2 className="text-5xl border-b border-slate-300 pb-1 my-2 uppercase mb-10">
        {department.name} Department
      </h2>
      <div className="space-y-3">
        {department.courses?.map((course, idx2) => {
          const total = calculateTotal(course.fields);

          return (
            <div
              className="border-b border-slate-700 pb-1"
              key={`course-${idx2}`}
            >
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
      </div>
    </React.Fragment>
  ));
};

export default MarksSheet;
