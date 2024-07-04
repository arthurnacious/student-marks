"use client";
import RecentTableSkeleton from "@/components/skeleton/recent-table";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetLatestUsers } from "@/query/latest";
import { formatDistance, subDays } from "date-fns";
import React, { FC } from "react";

interface Props {}

const RecentUsersTable: FC<Props> = ({}) => {
  const limit = 10;
  const { data: users, isLoading } = useGetLatestUsers(limit);

  if (isLoading) {
    return <RecentTableSkeleton length={limit} />;
  }

  return (
    <div className="border-neutral-500/50 h-full w-full bg-neutral-800/20 rounded border">
      <h2 className="text-3xl m-5">Recent Users</h2>
      <Table>
        <TableCaption>{limit} most recent users.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Registered...</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users?.map((user) => (
            <TableRow key={`user-${user.id}`}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>
                {formatDistance(
                  subDays(new Date(user.createdAt), 3),
                  new Date(user.createdAt),
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

export default RecentUsersTable;
