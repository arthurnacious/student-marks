"use client";
import React from "react";
import { DataTable } from "@/components/data-table";
import {
  useBulkDeleteAcademiesLecturers,
  useGetAcademiesLecturers,
  useGetAcademyBySlug,
} from "@/query/academies";
import TableSkeleton from "@/components/skeleton/table";
import { notFound } from "next/navigation";
import AddAcademyLecturersModal from "./crud/add-lecturer";
import { columns } from "./columns";

interface Props {
  slug: string;
}

const AcademyLecturersTable: React.FC<Props> = ({ slug }) => {
  const { data: academyData, isLoading: academyLoading } =
    useGetAcademyBySlug(slug);
  const { data, isLoading } = useGetAcademiesLecturers(slug);
  const { mutate, isPending } = useBulkDeleteAcademiesLecturers(
    academyData?.id ?? ""
  );
  if (!academyLoading && !academyData) {
    return notFound();
  }

  return (
    <div>
      <AddAcademyLecturersModal
        academyId={academyData?.id!}
        academiesLecturers={data!}
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
            There are no lecturers for this academy.
          </h3>
        </div>
      )}
    </div>
  );
};

export default AcademyLecturersTable;
