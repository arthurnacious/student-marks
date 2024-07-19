"use client";
import React from "react";
import { DataTable } from "@/components/data-table";
import {
  useBulkDeleteDepartmentsLecturers,
  useGetDepartmentsLecturers,
  useGetDepartmentBySlug,
} from "@/query/departments";
import TableSkeleton from "@/components/skeleton/table";
import { notFound } from "next/navigation";
import AddDepartmentLecturersModal from "./crud/add-lecturer";
import { columns } from "./columns";

interface Props {
  slug: string;
}

const DepartmentLecturersTable: React.FC<Props> = ({ slug }) => {
  const { data: departmentData, isLoading: departmentLoading } =
    useGetDepartmentBySlug(slug);
  const { data, isLoading } = useGetDepartmentsLecturers(slug);
  const { mutate, isPending } = useBulkDeleteDepartmentsLecturers(
    departmentData?.id ?? ""
  );
  if (!departmentLoading && !departmentData) {
    return notFound();
  }

  return (
    <div>
      <AddDepartmentLecturersModal
        departmentId={departmentData?.id!}
        departmentsLecturers={data!}
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
            There are no lecturers for this department.
          </h3>
        </div>
      )}
    </div>
  );
};

export default DepartmentLecturersTable;
