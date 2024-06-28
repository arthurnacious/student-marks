"use client";
import { useGetClasseBySlug } from "@/query/classes";
import React, { FC } from "react";
import { DataTable } from "@/components/data-table";
import { columns } from "./columns";
import TableSkeleton from "@/components/skeleton/table";
import AddSessionsModal from "../add-session";
import { TheClass } from "../../students";
import { useBulkDeleteSessionsFromClass } from "@/query/class-sessions";

interface Props {
  theClass: TheClass;
}

const StudentsTab: FC<Props> = ({ theClass }) => {
  const { data, isLoading } = useGetClasseBySlug(theClass.slug, theClass);
  const removeSessions = useBulkDeleteSessionsFromClass(theClass.id);
  return (
    <>
      <div>
        <AddSessionsModal theClass={theClass} />
      </div>
      {isLoading ? (
        <TableSkeleton cols={4} />
      ) : data && data.sessions && data.sessions.length > 0 ? (
        <DataTable
          columns={columns}
          onDelete={(rows) => {
            const ids = rows.map((row) => row.original.id);
            removeSessions.mutate({ ids });
          }}
          isLoading={removeSessions.isPending || isLoading}
          data={data.sessions}
        />
      ) : (
        <div className="flex items-center justify-center">
          <h3 className="text-2xl ">There are no sessions for this class.</h3>
        </div>
      )}
    </>
  );
};

export default StudentsTab;
