import PageContainerWrapper from "@/components/page-container-wrapper";
import React from "react";
import DepartmentsTable from "@/components/page-components/departments/departments-table";

interface Props {}

const Page: React.FC<Props> = ({}) => {
  return (
    <PageContainerWrapper title="Departments">
      <div className="w-full h-full border border-neutral-500/50 bg-neutral-800/20 rounded p-8">
        <DepartmentsTable />
      </div>
    </PageContainerWrapper>
  );
};

export default Page;
