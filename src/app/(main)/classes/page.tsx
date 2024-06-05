import PageContainerWrapper from "@/components/page-container-wrapper";
import React from "react";
import { client } from "@/lib/hono";
interface Props {}

const Page: React.FC<Props> = async () => {
  const response = await client.api.classes.$get();
  const data = await response.json();

  return (
    <PageContainerWrapper title="classes">
      <div className="w-full h-full border border-neutral-500/50 bg-neutral-800/20 rounded p-8"></div>
    </PageContainerWrapper>
  );
};

export default Page;
