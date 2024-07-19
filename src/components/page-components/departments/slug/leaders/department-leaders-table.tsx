"use client";
import React from "react";
import { DataTable } from "@/components/data-table";
import { columns } from "./columns";
import AddDepartmentLeadersModal from "./crud/add-leader";
import {
  useBulkDeleteDepartmentsLeaders,
  useGetDepartmentsLeaders,
  useGetDepartmentBySlug,
} from "@/query/departments";
import TableSkeleton from "@/components/skeleton/table";
import { not } from "drizzle-orm";
import { notFound } from "next/navigation";

interface Props {
  slug: string;
}

const DepartmentLeadersTable: React.FC<Props> = ({ slug }) => {
  const { data: departmentData, isLoading: departmentLoading } =
    useGetDepartmentBySlug(slug);
  const { data, isLoading } = useGetDepartmentsLeaders(slug);
  const { mutate, isPending } = useBulkDeleteDepartmentsLeaders(
    departmentData?.id ?? ""
  );
  if (!departmentLoading && !departmentData) {
    return notFound();
  }

  return (
    <div>
      <AddDepartmentLeadersModal
        departmentId={departmentData?.id!}
        departmentsLeaders={data!}
      />
      {departmentLoading || isLoading ? (
        <TableSkeleton cols={4} />
      ) : data && data?.length > 0 ? (
        <DataTable
          columns={columns}
          onDelete={(rows) => {
            const ids = rows.map((row) => row.original.id);
            mutate({ ids });
          }}
          isLoading={isPending}
          data={data}
          // searchCol="name"
        />
      ) : (
        <div className="flex items-center justify-center">
          <h3 className="text-2xl ">
            There are no department leaders for this department.
          </h3>
        </div>
      )}
    </div>
  );
};

export default DepartmentLeadersTable;
