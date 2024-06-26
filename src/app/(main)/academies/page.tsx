import PageContainerWrapper from "@/components/page-container-wrapper";
import React from "react";
import AcademiesTable from "@/components/page-components/academies/academies-table";

interface Props {}

const Page: React.FC<Props> = ({}) => {
  return (
    <PageContainerWrapper title="Academies">
      <div className="w-full h-full border border-neutral-500/50 bg-neutral-800/20 rounded p-8">
        <AcademiesTable />
      </div>
    </PageContainerWrapper>
  );
};

export default Page;
