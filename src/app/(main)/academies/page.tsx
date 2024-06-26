import PageContainerWrapper from "@/components/page-container-wrapper";
import React from "react";
import AcademiesTable from "./_components/academies-table";
import { client } from "@/lib/hono";
interface Props {}

const Page: React.FC<Props> = async () => {
  const response = await client.api.academies.$get();
  const { data } = await response.json();

  return (
    <PageContainerWrapper title="Academies">
      <div className="w-full h-full border border-neutral-500/50 bg-neutral-800/20 rounded p-8">
        <AcademiesTable initialData={data} />
      </div>
    </PageContainerWrapper>
  );
};

export default Page;
