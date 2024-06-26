"use client";
import React from "react";
import { DataTable } from "@/components/data-table";
import { columns } from "./columns";
import AddAcademModal from "./crud/add-academy";
import { useBulkDeleteAcademies, useGetAcademies } from "@/query/academies";
import TableSkeleton from "@/components/skeleton/table";

interface Props {}

const AcademiesTable: React.FC<Props> = ({}) => {
  const { data, isLoading } = useGetAcademies();
  const deleteAcademies = useBulkDeleteAcademies();

  return (
    <div>
      <AddAcademModal />
      {isLoading ? (
        <TableSkeleton cols={4} />
      ) : data && data?.length > 0 ? (
        <DataTable
          columns={columns}
          onDelete={(rows) => {
            const ids = rows.map((row) => row.original.id);
            deleteAcademies.mutate({ ids });
          }}
          isLoading={deleteAcademies.isPending}
          data={data}
          searchCol="name"
        />
      ) : (
        <div className="flex items-center justify-center">
          <h3 className="text-2xl ">There are no academies on the system.</h3>
        </div>
      )}
    </div>
  );
};

export default AcademiesTable;
