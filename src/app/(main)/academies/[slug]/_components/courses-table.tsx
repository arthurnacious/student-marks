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
  academy: {
    name: string;
  };
  courses: {
    id: string;
    academyId: string;
    createdAt: string;
    updatedAt: string | null;
  }[];
}

const CoursesTable: FC<Props> = ({ academy, courses }) => {
  return (
    <Table>
      <TableCaption className="my-5">
        A list of {academy.name} courses.
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Registered...</TableHead>
          <TableHead className="text-right">Active Till</TableHead>
        </TableRow>
      </TableHeader>
      {/* <TableBody>
        {courses.map((pivot) => (
          <TableRow key={pivot.id}>
            <TableCell>{pivot.lecturer.name}</TableCell>
            <TableCell>{getStatus(pivot.lecturer.createdAt)}</TableCell>
            <TableCell className="text-right">
              {formatDistance(
                subDays(new Date(pivot.lecturer.createdAt), 3),
                new Date(pivot.lecturer.createdAt),
                {
                  addSuffix: true,
                }
              )}
            </TableCell>
            <TableCell className="text-right">
              {pivot.lecturer.activeTill
                ? format(new Date(pivot.lecturer.activeTill), "d-MMMM-Y")
                : "Indefinately"}
            </TableCell>
          </TableRow>
        ))}
      </TableBody> */}
    </Table>
  );
};

export default CoursesTable;
