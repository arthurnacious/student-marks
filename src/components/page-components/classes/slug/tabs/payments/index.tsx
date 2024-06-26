"use client";
import { useGetClasseBySlug } from "@/query/classes";
import React, { FC } from "react";
import { DataTable } from "@/components/data-table";
import { columns } from "./columns";
import TableSkeleton from "@/components/skeleton/table";
import { ThemeColorDescriptor } from "next/dist/lib/metadata/types/metadata-types";
import { TheClass } from "../students";
import PaymentsTable from "./payments-table";

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
      ) : data?.data && data.data?.students?.length > 0 ? (
        <PaymentsTable theClass={theClass} />
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
