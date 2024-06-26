"use client";
import React from "react";
import { DataTable } from "@/components/data-table";
import { columns } from "./columns";
import AddUserModal from "./crud/add-user-modal";
import { useBulkDeleteUsers, useGetUsers } from "@/query/users";
import TableSkeleton from "@/components/skeleton/table";

interface Props {}

const UsersTable: React.FC<Props> = ({}) => {
  const { data, isLoading } = useGetUsers();
  const deleteUsers = useBulkDeleteUsers();
  return (
    <div>
      <AddUserModal />
      {isLoading ? (
        <TableSkeleton cols={4} />
      ) : data && data?.length > 0 ? (
        <DataTable
          columns={columns}
          onDelete={(rows) => {
            const ids = rows.map((row) => row.original.id);
            deleteUsers.mutate({ ids });
          }}
          isLoading={deleteUsers.isPending}
          data={data}
          searchCol="name"
        />
      ) : (
        <div className="flex items-center justify-center">
          <h3 className="text-2xl ">There are no users on the system.</h3>
        </div>
      )}
    </div>
  );
};

export default UsersTable;
