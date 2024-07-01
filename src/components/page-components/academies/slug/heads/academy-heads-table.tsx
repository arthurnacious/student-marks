"use client";
import React from "react";
import { DataTable } from "@/components/data-table";
import { columns } from "./columns";
import AddAcademyHeadsModal from "./crud/add-head";
import {
  useBulkDeleteAcademiesHeads,
  useGetAcademiesHeads,
  useGetAcademyBySlug,
} from "@/query/academies";
import TableSkeleton from "@/components/skeleton/table";
import { not } from "drizzle-orm";
import { notFound } from "next/navigation";

interface Props {
  slug: string;
}

const AcademyHeadsTable: React.FC<Props> = ({ slug }) => {
  const { data: academyData, isLoading: academyLoading } =
    useGetAcademyBySlug(slug);
  const { data, isLoading } = useGetAcademiesHeads(slug);
  const { mutate, isPending } = useBulkDeleteAcademiesHeads(
    academyData?.id ?? ""
  );
  if (!academyLoading && !academyData) {
    return notFound();
  }

  return (
    <div>
      <AddAcademyHeadsModal
        academyId={academyData?.id!}
        academiesHeads={data!}
      />
      {academyLoading || isLoading ? (
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
            There are no academy heads for this academy.
          </h3>
        </div>
      )}
    </div>
  );
};

export default AcademyHeadsTable;
