"use client";
import React from "react";
import { DataTable } from "@/components/data-table";
import { columns } from "./columns";
import { useBulkDeleteClasses, useGetClasses } from "@/query/classes";
import TableSkeleton from "@/components/skeleton/table";
import AddClassModal from "./crud/add-class";

interface Props {}

const ClassesTable: React.FC<Props> = ({}) => {
  const { data, isLoading } = useGetClasses();
  const deleteClasses = useBulkDeleteClasses();

  return (
    <div>
      <AddClassModal />
      {isLoading ? (
        <TableSkeleton cols={4} />
      ) : data && data?.length > 0 ? (
        <DataTable
          columns={columns}
          onDelete={(rows) => {
            const ids = rows.map((row) => row.original.id);
            deleteClasses.mutate({ ids });
          }}
          isLoading={deleteClasses.isPending}
          data={data}
        />
      ) : (
        <div className="flex items-center justify-center">
          <h3 className="text-2xl ">There are no classes on the system.</h3>
        </div>
      )}
    </div>
  );
};

export default ClassesTable;
