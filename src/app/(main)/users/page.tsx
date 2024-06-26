import PageContainerWrapper from "@/components/page-container-wrapper";
import React from "react";
import { client } from "@/lib/hono";
import UsersTable from "@/components/page-components/users/users-table";
interface Props {}

const Page: React.FC<Props> = () => {
  return (
    <PageContainerWrapper title="Users">
      <div className="w-full h-full border border-neutral-500/50 bg-neutral-800/20 rounded p-8">
        <UsersTable />
      </div>
    </PageContainerWrapper>
  );
};

export default Page;
