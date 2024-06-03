"use client";
import React from "react";
import { DataTable } from "@/components/data-table";
import { Academies, columns } from "./columns";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import AddAcademModal from "./crud/add-academy";
import { client } from "@/lib/hono";
import { useBulkDeleteAcademies, useGetAcademies } from "@/query/academies";
import { Loader2 } from "lucide-react";
import TableSkeleton from "@/components/skeleton/table";
interface Props {
  initialData: any;
}

const AcademiesTable: React.FC<Props> = ({ initialData }) => {
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
