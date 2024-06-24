"use client";
import { useGetClasseBySlug } from "@/query/classes";
import React, { FC } from "react";
import TableSkeleton from "@/components/skeleton/table";
import { TheClass } from "../students";
import MarksTable from "./marks.table";

interface Props {
  theClass: TheClass;
}

const MarksTab: FC<Props> = ({ theClass }) => {
  const { data, isLoading } = useGetClasseBySlug(theClass.slug, theClass);

  return (
    <>
      <div>{/* <AddSessionsModal theClass={theClass} /> */}</div>
      {isLoading ? (
        <TableSkeleton cols={4} />
      ) : (
        <MarksTable theClass={theClass} />
      )}
    </>
  );
};

export default MarksTab;
