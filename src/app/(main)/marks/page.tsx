import PageContainerWrapper from "@/components/page-container-wrapper";
import React from "react";
import { client } from "@/lib/hono";
import { cn } from "@/lib/utils";
import {
  calculateBackgroundColor,
  calculateTotal,
  groupData,
  transformData,
} from "@/lib/marks-functions";
interface Props {}

const Page: React.FC<Props> = async () => {
  const userId = "e61dec48-fd2d-4a2c-8e73-4b8fcbc5d032";
  const response = await client.api.marks[":userId"].$get({
    param: { userId },
  });

  const data = await response.json();

  const academiesMap = groupData(data);
  const academies = transformData(academiesMap);

  return (
    <PageContainerWrapper title="Marks">
      <div className="w-full h-full border border-neutral-500/50 bg-neutral-800/20 rounded p-8">
        {academies.map((academy, idx) => (
          <React.Fragment key={`academy-${idx}`}>
            <h2 className="text-5xl border-b border-slate-500 pb-1 my-2 capitalize">
              {academy.name}
            </h2>
            {academy.courses.map((course, idx2) => {
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
      </div>
    </PageContainerWrapper>
  );
};

export default Page;
