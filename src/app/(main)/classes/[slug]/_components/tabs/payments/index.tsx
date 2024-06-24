"use client";
import { useGetClasseBySlug } from "@/query/classes";
import React, { FC } from "react";
import { DataTable } from "@/components/data-table";
import { columns } from "./columns";
import TableSkeleton from "@/components/skeleton/table";
import { ThemeColorDescriptor } from "next/dist/lib/metadata/types/metadata-types";
import { TheClass } from "../students";

interface Props {
  theClass: TheClass;
}

const PaymentsTab: FC<Props> = ({ theClass }) => {
  const { data, isLoading } = useGetClasseBySlug(theClass.slug, theClass);
  return (
    <>
      <div>{/* <AddStudentsModal theClass={theClass} /> */}</div>
      {isLoading ? (
        <TableSkeleton cols={4} />
      ) : data && data.students?.length > 0 ? (
        <DataTable
          deleteWording="Remove Student"
          columns={columns}
          onDelete={(rows) => {
            const ids = rows.map((row) => row.original.id);
            // removeStudents.mutate({ ids });
          }}
          // isLoading={removeStudents.isPending || isLoading}
          isLoading={isLoading}
          data={data.students}
        />
      ) : (
        <div className="flex items-center justify-center">
          <h3 className="text-2xl ">
            There are no students enrolled for this class.
          </h3>
        </div>
      )}
    </>
  );
};

export default PaymentsTab;
