import PageContainerWrapper from "@/components/page-container-wrapper";
import React from "react";
import UserInfo from "@/components/page-components/users/id/user-info";

interface Props {
  params: {
    id: string;
  };
}

const ViewUserPage: React.FC<Props> = ({ params: { id } }) => {
  return (
    <PageContainerWrapper title="View User">
      <UserInfo studentId={id} />
    </PageContainerWrapper>
  );
};

export default ViewUserPage;
