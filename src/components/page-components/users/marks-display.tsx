"use client";
import { groupData, transformData } from "@/lib/marks-functions";
import { useGetStudentsMarks } from "@/query/student-marks";
import { Loader2 } from "lucide-react";
import React from "react";
import MarksSheet from "./marks-sheet";
import { useGetUserById } from "@/query/users";

interface Props {
  studentId: string;
}

const MarksDisplay: React.FC<Props> = ({ studentId }) => {
  const { data, isLoading } = useGetStudentsMarks(studentId);
  const { data: user, isLoading: userIsLoading } = useGetUserById(studentId);

  if (isLoading || userIsLoading) {
    return (
      <div className="flex flex-col gap-2 justify-center items-center">
        <p className="text-3xl">
          Loading student data <span className="animate-ping">...</span>
        </p>
        <Loader2 className="size-24 animate-spin" />
      </div>
    );
  }

  if (!data && !isLoading && !user && !userIsLoading) {
    return <div>Student has not marks allocation</div>;
  }

  const departmentsMap = groupData(data);
  const departments = transformData(departmentsMap);

  return (
    <>
      {departments.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full">
          <div className="text-center">
            <p className="text-2xl"> Student has no marks</p>
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto border border-neutral-500/50 p-10 bg-neutral-900">
          <div className="text-center space-y-3 mb-16">
            <h4 className="text-7xl font-graduate italic">
              Recognition Statement
            </h4>
            <div className="space-y-3">
              <div className="text-4xl font-serif">Proudly presented to:</div>
              <div className="text-2xl capitalize font-cedarville-cursive border-b w-fit mx-auto">
                {user?.name ?? ""}
              </div>
            </div>
          </div>
          <MarksSheet departments={departments} />
        </div>
      )}
    </>
  );
};

export default MarksDisplay;
