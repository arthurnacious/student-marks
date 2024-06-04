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
  academy: {
    name: string;
  };
  heads: {
    id: string;
    academyId: string;
    academyHeadId: string;
    head: {
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

const HeadsTable: FC<Props> = ({ academy, heads }) => {
  return (
    <Table>
      <TableCaption className="my-5">
        A list of {academy.name} heads.
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Registered...</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {heads.map((pivot) => (
          <TableRow key={pivot.id}>
            <TableCell>{pivot.head.name}</TableCell>
            <TableCell>{getStatus(pivot.head.createdAt)}</TableCell>
            <TableCell className="text-right">
              {formatDistance(
                subDays(new Date(pivot.head.createdAt), 3),
                new Date(pivot.head.createdAt),
                {
                  addSuffix: true,
                }
              )}
            </TableCell>
            <TableCell className="text-right">
              {pivot.head.activeTill
                ? format(new Date(pivot.head.activeTill), "d-MMMM-y")
                : "Indefinately"}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default HeadsTable;
