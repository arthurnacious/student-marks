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
  lecturers: {
    id: string;
    academyId: string;
    lecturerId: string;
    lecturer: {
      id: string;
      role: string;
      image: string | null;
      name: string;
      email: string;
      emailVerified: string | null;
      activeTill: string | null;
      createdAt: string;
      updatedAt: string | null;
    };
  }[];
}

function getStatus(createdAt?: string): React.ReactNode {
  const date = createdAt ? new Date(createdAt) : undefined;
  let diff = date ? new Date().getTime() - date.getTime() : -1;
  return !date && diff > 0 ? (
    <span className="bg-orange-600/20 rounded-lg px-2">Inactive</span>
  ) : (
    <span className="bg-green-600/20 rounded-lg px-2">Active</span>
  );
}

const LecturersTable: FC<Props> = ({ academy, lecturers }) => {
  return (
    <Table>
      <TableCaption className="my-5">
        A list of {academy.name} lecturers.
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Registered...</TableHead>
          <TableHead className="text-right">Active Till</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {lecturers.map((pivot) => (
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
                ? format(new Date(pivot.lecturer.activeTill), "d-MMMM-y")
                : "Indefinately"}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default LecturersTable;
