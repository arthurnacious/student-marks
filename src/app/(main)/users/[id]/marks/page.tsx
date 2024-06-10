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
import { notFound } from "next/navigation";
import BackButton from "@/components/back-button";
import { ArrowLeft } from "lucide-react";
interface Props {
  params: {
    id: string;
  };
}

const UserMarksPage: React.FC<Props> = async ({ params: { id } }) => {
  const [student, data] = await Promise.all([
    client.api.users[":id"]
      .$get({
        param: { id },
      })
      .then(async (response) => {
        const data = await response.json();
        return data.data;
      }),
    client.api.marks[":userId"]
      .$get({
        param: { userId: id },
      })
      .then(async (response) => await response.json()),
  ]);

  const academiesMap = groupData(data);
  const academies = transformData(academiesMap);

  if (!student) return notFound();

  return (
    <PageContainerWrapper
      title="Marks"
      trail={
        <>
          <BackButton>
            <ArrowLeft /> Back
          </BackButton>
        </>
      }
    >
      <div className="w-full h-full border border-neutral-500/50 bg-neutral-800/20 rounded p-8">
        {academies.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="text-center">
              <p className="text-2xl"> {student.name} has no marks</p>
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
      </div>
    </PageContainerWrapper>
  );
};

export default UserMarksPage;
