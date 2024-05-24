import PageContainerWrapper from "@/components/page-container-wrapper";
import React from "react";
interface Props {}

const Page: React.FC<Props> = () => {
  return (
    <PageContainerWrapper title="Academies">
      <div className="w-full h-full border border-neutral-500/50 bg-neutral-800/20 rounded p-8">
        react table
      </div>
    </PageContainerWrapper>
  );
};

export default Page;
