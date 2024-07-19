import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
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
  leaders?: {
    id: string;
    departmentId: string;
    departmentLeaderId: string;
    leader: {
      id: string;
      name: string;
      email: string;
      emailVerified: string | null;
      image: string | null;
      role: string;
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

const LeadersTable: FC<Props> = ({ department, leaders }) => {
  return (
    <Table>
      <TableCaption className="my-5">
        A list of {department?.name ?? "Department"} heads.
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
        {leaders?.map((pivot) => (
          <TableRow key={pivot.id}>
            <TableCell>{pivot.leader.name}</TableCell>
            <TableCell>{getStatus(pivot.leader.createdAt)}</TableCell>
            <TableCell className="text-right">
              {formatDistance(
                subDays(new Date(pivot.leader.createdAt), 3),
                new Date(pivot.leader.createdAt),
                {
                  addSuffix: true,
                }
              )}
            </TableCell>
            <TableCell className="text-right">
              {pivot.leader.activeTill
                ? format(new Date(pivot.leader.activeTill), "d-MMMM-y")
                : "Indefinately"}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default LeadersTable;
