import PageContainerWrapper from "@/components/page-container-wrapper";
import React, { FC } from "react";
import ClassesTable from "./_components/classes-table";
import { client } from "@/lib/hono";

interface Props {}

const ClassesPage: FC<Props> = async ({}) => {
  const response = await client.api.classes.$get();
  const data = await response.json();

  return (
    <PageContainerWrapper title="Classes">
      <div className="w-full min-h-[calc(100dvh-12rem)] h-full border border-neutral-500/50 bg-neutral-800/20 rounded p-8">
        <ClassesTable initialData={data} />
      </div>
    </PageContainerWrapper>
  );
};

export default ClassesPage;
