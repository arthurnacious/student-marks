"use client";
import RecentTableSkeleton from "@/components/skeleton/recent-table";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { latestClassesUrl, useGetLatestClasses } from "@/query/latest";
import { formatDistance, subDays } from "date-fns";
import { InferResponseType } from "hono";
import React, { FC } from "react";

interface Props {}
type ClassData = InferResponseType<typeof latestClassesUrl>["data"][0];

const calculateStudentAttendance = (classData: ClassData): number => {
  const { students, sessions, attendance, id } = classData;
  const expectedAttendance = students * sessions;
  // const isConsistent = attendance === expectedAttendance;

  let attendancePercentage = 100;

  if (sessions > 0) {
    attendancePercentage = (attendance / (students * sessions)) * 100;
  }
  return Math.round(attendancePercentage);
};

const RecentClassesTable: FC<Props> = ({}) => {
  const limit = 10;
  const { data: classes, isLoading } = useGetLatestClasses(limit);

  if (isLoading) {
    return <RecentTableSkeleton length={limit} />;
  }

  return (
    <div className="border-neutral-500/50 h-full w-full bg-neutral-800/20 rounded border">
      <h2 className="text-3xl m-5">Recent Classes</h2>
      <Table>
        <TableCaption>{classes?.length} most recent classes.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Course Name</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Students</TableHead>
            <TableHead>lecturer</TableHead>
            <TableHead>Attendance</TableHead>
            <TableHead>Ran...</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {classes?.map((clas) => (
            <TableRow key={clas.id}>
              <TableCell>{clas.course.name}</TableCell>
              <TableCell>{clas.course.department?.name} Department</TableCell>
              <TableCell>{clas.students}</TableCell>
              <TableCell>{clas.lecturer.name}</TableCell>
              <TableCell>{calculateStudentAttendance(clas)} %</TableCell>
              <TableCell>
                {formatDistance(
                  subDays(new Date(clas.createdAt), 3),
                  new Date(clas.createdAt),
                  {
                    addSuffix: true,
                  }
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default RecentClassesTable;
