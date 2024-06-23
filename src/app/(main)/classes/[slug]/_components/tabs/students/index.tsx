"use client";
import { useGetClasseBySlug } from "@/query/classes";
import AddStudentsModal from "./add-students";
import React, { FC } from "react";
import { DataTable } from "@/components/data-table";
import { columns } from "./columns";
import TableSkeleton from "@/components/skeleton/table";

interface Props {
  theClass: {
    id: string;
    slug: string;
    price: number;
    notes: string | null;
    students: {
      id: string;
      studentId: string;
    }[];
  };
}

const StudentsTab: FC<Props> = ({ theClass }) => {
  const { data, isLoading } = useGetClasseBySlug(theClass.slug, theClass);
  console.log({ data });
  return (
    <>
      <div>
        <AddStudentsModal theClass={theClass} />
      </div>
      {isLoading ? (
        <TableSkeleton cols={4} />
      ) : data && data.students?.length > 0 ? (
        <DataTable
          columns={columns}
          onDelete={(rows) => {
            const ids = rows.map((row) => row.original.id);
            deleteClasses.mutate({ ids });
          }}
          // isLoading={deleteClasses.isPending || isLoading}
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

export default StudentsTab;
