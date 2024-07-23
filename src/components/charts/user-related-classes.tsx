"use client";
import { useGetClassesGraphData, useGetUsersGraphData } from "@/query/graph";
import React, { FC } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Skeleton } from "../ui/skeleton";
import { InputData, transformData, TransformedData } from "@/lib/graphs";
import { useSelectedYearStore } from "@/store/selected-year";

interface Props {}

const UserRelatedClasses: FC<Props> = ({}) => {
  const { year } = useSelectedYearStore();
  const usersData = useGetUsersGraphData(year);
  const classesData = useGetClassesGraphData(year);

  const isLoading = usersData.isLoading || classesData.isLoading;

  if (isLoading) {
    return (
      <div>
        <Skeleton className="h-10 w-80 my-2" />
        <div className="my-5">
          <Skeleton className="h-[23rem] my-2" />
        </div>
      </div>
    );
  }

  const inputData: InputData = {
    presented: { data: usersData.data },
    attended: { data: classesData.data },
  };

  const data: TransformedData[] = transformData(inputData);

  return (
    <div className="w-full border border-neutral-500/50 bg-neutral-800/20 rounded py-5 md:p-5 mb-5">
      <h2 className="text-3xl">{year} Courses</h2>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Presented" fill="#323333" />
          <Bar dataKey="Attended" fill="#1e1f1f" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default UserRelatedClasses;
