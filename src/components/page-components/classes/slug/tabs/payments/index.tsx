"use client";
import { useGetClasseBySlug } from "@/query/classes";
import React, { FC } from "react";
import TableSkeleton from "@/components/skeleton/table";
import { TheClass } from "../students";
import PaymentsTable from "./payments-table";

interface Props {
  theClass: TheClass;
}

const PaymentsTab: FC<Props> = ({ theClass }) => {
  const { data, isLoading } = useGetClasseBySlug(theClass.slug, theClass);

  if (isLoading) return <TableSkeleton cols={4} />;

  if (!data) {
    return <div>No data</div>;
  }

  return data && data.students?.length > 0 ? (
    <PaymentsTable theClass={theClass} />
  ) : (
    <div className="flex items-center justify-center">
      <h3 className="text-2xl ">
        There are no students enrolled for this class.
      </h3>
    </div>
  );
};

export default PaymentsTab;
