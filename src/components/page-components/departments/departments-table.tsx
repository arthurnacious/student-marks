"use client";
import React, { useState } from "react";
import { DataTable } from "@/components/data-table";
import { columns } from "./columns";
import AddDepartmentModal from "./crud/add-department-modal";
import {
  useBulkDeleteDepartments,
  useGetDepartments,
} from "@/query/departments";
import TableSkeleton from "@/components/skeleton/table";
import EditDepartmentModal from "./crud/edit-department-modal";

interface Props {}

const DepartmentsTable: React.FC<Props> = ({}) => {
  const [departmentSlug, setDepartmentSlug] = useState<string | undefined>(
    undefined
  );
  const { data, isLoading } = useGetDepartments();
  const deleteDepartments = useBulkDeleteDepartments();

  return (
    <div>
      <EditDepartmentModal
        departmentSlug={departmentSlug}
        setDepartmentSlug={setDepartmentSlug}
      />
      <AddDepartmentModal />
      {isLoading ? (
        <TableSkeleton cols={4} />
      ) : data && data?.length > 0 ? (
        <DataTable
          columns={columns({ setDepartmentSlug: setDepartmentSlug })}
          onDelete={(rows) => {
            const ids = rows.map((row) => row.original.id);
            deleteDepartments.mutate({ ids });
          }}
          isLoading={deleteDepartments.isPending}
          data={data}
          searchCol="name"
        />
      ) : (
        <div className="flex items-center justify-center">
          <h3 className="text-2xl ">There are no departments on the system.</h3>
        </div>
      )}
    </div>
  );
};

export default DepartmentsTable;
