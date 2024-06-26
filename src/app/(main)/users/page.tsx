import PageContainerWrapper from "@/components/page-container-wrapper";
import React from "react";
import { client } from "@/lib/hono";
import UsersTable from "./_components/users-table";
interface Props {}

const Page: React.FC<Props> = async () => {
  const response = await client.api.users.role[":role?"].$get({
    param: { role: "" },
  });
  const data = await response.json();

  console.log({ data });

  return (
    <PageContainerWrapper title="Users">
      <div className="w-full h-full border border-neutral-500/50 bg-neutral-800/20 rounded p-8">
        <UsersTable initialData={data} />
      </div>
    </PageContainerWrapper>
  );
};

export default Page;
