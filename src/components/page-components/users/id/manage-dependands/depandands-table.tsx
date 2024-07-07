"use client";
import React from "react";
import { DataTable } from "@/components/data-table";
import { columns } from "./columns";
import {
  useBulkDeleteUsers,
  useGetUserById,
  useGetUsers,
  useGetUsersDependents,
} from "@/query/users";
import TableSkeleton from "@/components/skeleton/table";

interface Props {
  userId: string;
}

const DependentsTable: React.FC<Props> = ({ userId }) => {
  const { data, isLoading } = useGetUsersDependents(userId);
  const { data: user, isLoading: isLoadingUser } = useGetUserById(userId);
  const deleteUsers = useBulkDeleteUsers();
  return (
    <div>
      {/* <AddUserModal /> */}
      {isLoading || isLoadingUser ? (
        <TableSkeleton cols={4} />
      ) : data && data?.length > 0 ? (
        <DataTable
          columns={columns}
          onDelete={(rows) => {
            const ids = rows.map(({ original: { id } }) => id);
            deleteUsers.mutate({ ids });
          }}
          isLoading={deleteUsers.isPending}
          data={data}
          // searchCol="name"
        />
      ) : (
        <div className="flex items-center justify-center">
          <h3 className="text-2xl ">{user?.name} has no dependents.</h3>
        </div>
      )}
    </div>
  );
};

export default DependentsTable;
