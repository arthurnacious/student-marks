"use client";
import React from "react";
import { DataTable } from "@/components/data-table";
import {
  useBulkDeleteAcademiesLecturers,
  useGetAcademiesInventories,
  useGetAcademyBySlug,
} from "@/query/academies";
import TableSkeleton from "@/components/skeleton/table";
import { notFound } from "next/navigation";
import { columns } from "./columns";
import AddAcademyInventoryModal from "./crud/add-inventory";
import { useBulkDeleteMaterials } from "@/query/materials";

interface Props {
  slug: string;
}

const AcademyInventoriesTable: React.FC<Props> = ({ slug }) => {
  const { data: academyData, isLoading: academyLoading } =
    useGetAcademyBySlug(slug);
  const { data, isLoading } = useGetAcademiesInventories(slug);
  const { mutate, isPending } = useBulkDeleteMaterials({});

  if (!academyLoading && !academyData) {
    return notFound();
  }

  return (
    <div>
      {academyData && (
        <h3 className="text-2xl mb-5">{academyData.name} Academy</h3>
      )}
      <AddAcademyInventoryModal academyId={academyData?.id!} />
      {academyLoading || isLoading ? (
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
            There are no inventories for this academy.
          </h3>
        </div>
      )}
    </div>
  );
};

export default AcademyInventoriesTable;
