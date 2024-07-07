import GetUserContainer from "@/components/page-components/users/id/get-user-container";
import PageContainerWrapper from "@/components/page-container-wrapper";
import React from "react";

interface Props {
  params: {
    id: string;
  };
}

const EditUserPage: React.FC<Props> = ({ params: { id } }) => {
  return (
    <PageContainerWrapper title="Edit User">
      <GetUserContainer userId={id} />
    </PageContainerWrapper>
  );
};

export default EditUserPage;
