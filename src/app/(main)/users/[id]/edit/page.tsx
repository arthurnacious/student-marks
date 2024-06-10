import PageContainerWrapper from "@/components/page-container-wrapper";
import React from "react";

interface Props {
  params: {
    id: string;
  };
}

const EditUserPage: React.FC<Props> = ({ params: { id } }) => {
  console.log({ id });
  return (
    <PageContainerWrapper title="Edit User">
      Edit User Page
    </PageContainerWrapper>
  );
};

export default EditUserPage;
