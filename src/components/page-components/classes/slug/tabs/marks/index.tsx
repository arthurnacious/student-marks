"use client";
import { useGetClasseBySlug } from "@/query/classes";
import React, { FC } from "react";
import TableSkeleton from "@/components/skeleton/table";
import { TheClass } from "../students";
import MarksTable from "./marks-table";
import { notFound } from "next/navigation";

interface Props {
  theClass: TheClass;
}

const MarksTab: FC<Props> = ({ theClass }) => {
  const { data, isLoading } = useGetClasseBySlug(theClass.slug, theClass);

  if (isLoading) return <TableSkeleton cols={4} />;

  if (!data) {
    return notFound();
  }

  return <MarksTable theClass={data} />;
};

export default MarksTab;
