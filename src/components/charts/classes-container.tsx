"use client";

import React, { FC } from "react";
import AttendedClases from "@/components/charts/attended-classes";
import PresentedClases from "@/components/charts/presented-clasess";
import { useGetUsersLatestPresentedClasses } from "@/query/latest";

interface Props {
  userId: string;
}

const ClassesContainer: FC<Props> = ({ userId }) => {
  const { data: presentedClases, isLoading } =
    useGetUsersLatestPresentedClasses(userId, 10);
  return (
    <div
      className={`grid grid-cols-1 ${
        presentedClases && presentedClases.length && "lg:grid-cols-2"
      } gap-2 w-full mt-2`}
    >
      <AttendedClases userId={userId} />
      {presentedClases && presentedClases.length > 0 && (
        <PresentedClases userId={userId} />
      )}
    </div>
  );
};

export default ClassesContainer;
