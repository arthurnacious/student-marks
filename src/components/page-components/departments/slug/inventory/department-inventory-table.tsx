"use client";
import React from "react";
import { DataTable } from "@/components/data-table";
import {
  useBulkDeleteDepartmentsLecturers,
  useGetDepartmentsInventories,
  useGetDepartmentBySlug,
} from "@/query/departments";
import TableSkeleton from "@/components/skeleton/table";
import { notFound } from "next/navigation";
import { columns } from "./columns";
import AddDepartmentInventoryModal from "./crud/add-inventory";
import { useBulkDeleteMaterials } from "@/query/materials";

interface Props {
  slug: string;
}

const DepartmentInventoriesTable: React.FC<Props> = ({ slug }) => {
  const { data: departmentData, isLoading: departmentLoading } =
    useGetDepartmentBySlug(slug);
  const { data, isLoading } = useGetDepartmentsInventories(slug);
  const { mutate, isPending } = useBulkDeleteMaterials({});

  if (!departmentLoading && !departmentData) {
    return notFound();
  }

  return (
    <div>
      {departmentData && (
        <h3 className="text-2xl mb-5">{departmentData.name} Department</h3>
      )}
      <AddDepartmentInventoryModal departmentId={departmentData?.id!} />
      {departmentLoading || isLoading ? (
        <TableSkeleton cols={4} />
      ) : data && data?.length > 0 ? (
        <DataTable
          columns={columns({})}
          isLoading={isPending}
          data={data}
          searchCol="name"
        />
      ) : (
        <div className="flex items-center justify-center">
          <h3 className="text-2xl ">
            There are no inventories for this department.
          </h3>
        </div>
      )}
    </div>
  );
};

export default DepartmentInventoriesTable;
