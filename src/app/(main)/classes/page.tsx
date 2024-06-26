import PageContainerWrapper from "@/components/page-container-wrapper";
import React, { FC } from "react";
import ClassesTable from "@/components/page-components/classes/classes-table";

interface Props {}

// export const fetchCache = "force-no-store";
const ClassesPage: FC<Props> = async ({}) => {
  return (
    <PageContainerWrapper title="Classes">
      <div className="w-full min-h-[calc(100dvh-12rem)] h-full border border-neutral-500/50 bg-neutral-800/20 rounded p-8">
        <ClassesTable />
      </div>
    </PageContainerWrapper>
  );
};

export default ClassesPage;
