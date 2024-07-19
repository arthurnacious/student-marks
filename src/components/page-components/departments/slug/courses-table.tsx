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
import { format, formatDistance, subDays } from "date-fns";
import React, { FC } from "react";

interface Props {
  department?: {
    name: string;
  };
  courses?: {
    id: string;
    name: string;
    status: string | null;
    createdAt: string;
    updatedAt: string | null;
  }[];
}

function getStatus(status: string | null): React.ReactNode {
  return status && status === "Active" ? (
    <span className="bg-green-600/20 rounded-lg px-2">Active</span>
  ) : (
    <span className="bg-red-600/20 rounded-lg px-2">Paused</span>
  );
}

const CoursesTable: FC<Props> = ({ department, courses }) => {
  return (
    <Table>
      <TableCaption className="my-5">
        A list of {department?.name ?? "Department"} courses.
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Registered...</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {courses?.map((course) => (
          <TableRow key={course.id}>
            <TableCell>{course.name}</TableCell>
            <TableCell>{getStatus(course.status)}</TableCell>
            <TableCell className="text-right">
              {formatDistance(
                subDays(new Date(course.createdAt), 3),
                new Date(course.createdAt),
                {
                  addSuffix: true,
                }
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default CoursesTable;
