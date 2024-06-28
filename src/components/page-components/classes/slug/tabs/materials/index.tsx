"use client";
import { useGetClasseBySlug } from "@/query/classes";
import React, { FC } from "react";
import TableSkeleton from "@/components/skeleton/table";
import { TheClass } from "../students";
import MaterialsTable from "./materials-table";

interface Props {
  theClass: TheClass;
}

const MaterialsTab: FC<Props> = ({ theClass }) => {
  const { data, isLoading } = useGetClasseBySlug(theClass.slug, theClass);

  if (isLoading) return <TableSkeleton cols={4} />;

  if (!data) {
    return <div>No data</div>;
  }

  return <MaterialsTable theClass={data} />;
};

export default MaterialsTab;
