import PageContainerWrapper from "@/components/page-container-wrapper";
import React from "react";

interface Props {
  params: {
    id: string;
  };
}

const ViewUserPage: React.FC<Props> = ({ params: { id } }) => {
  console.log({ id });
  return (
    <PageContainerWrapper title="View User">
      View User Page
    </PageContainerWrapper>
  );
};

export default ViewUserPage;
