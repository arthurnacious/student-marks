import DependentsTable from "@/components/page-components/users/id/manage-dependands/depandands-table";
import PageContainerWrapper from "@/components/page-container-wrapper";
import React from "react";

interface Props {
  params: {
    id: string;
  };
}

const EditUserPage: React.FC<Props> = ({ params: { id } }) => {
  return (
    <PageContainerWrapper title="User dependents">
      <div className="w-full h-full border border-neutral-500/50 bg-neutral-800/20 rounded p-8">
        <DependentsTable userId={id} />
      </div>
    </PageContainerWrapper>
  );
};

export default EditUserPage;
