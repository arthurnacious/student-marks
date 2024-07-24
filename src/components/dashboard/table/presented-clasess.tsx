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
import {
  latestClassesUrl,
  useGetLatestClasses,
  useGetUsersLatestPresentedClasses,
} from "@/query/latest";
import { formatDistance, subDays } from "date-fns";
import { InferResponseType } from "hono";
import { useSession } from "next-auth/react";
import React, { FC } from "react";

interface Props {
  userId: string;
}
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

const AttendedClases: FC<Props> = ({ userId }) => {
  const limit = 10;
  const { data: classes, isLoading } = useGetUsersLatestPresentedClasses(
    userId,
    limit
  );

  if (isLoading) {
    return <RecentTableSkeleton length={limit} />;
  }

  return (
    <div className="border-neutral-500/50 h-full w-full bg-neutral-800/20 rounded border">
      <h2 className="text-3xl m-5">Presented Classes</h2>
      <Table>
        <TableCaption>{classes?.length} most recent classes.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Course Name</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>lecturer</TableHead>
            <TableHead>Ran...</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {classes?.map(({ id, className, department, lecturer, date }) => (
            <TableRow key={id}>
              <TableCell>{className}</TableCell>
              <TableCell>{department} Department</TableCell>
              <TableCell>{lecturer}</TableCell>
              <TableCell>
                {formatDistance(subDays(new Date(date), 3), new Date(date), {
                  addSuffix: true,
                })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AttendedClases;
