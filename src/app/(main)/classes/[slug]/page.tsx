import PageContainerWrapper from "@/components/page-container-wrapper";
import React, { FC } from "react";
import { client } from "@/lib/hono";

interface Props {}

const PresentClass: FC<Props> = async ({}) => {
  return (
    <PageContainerWrapper title="Present Class">
      <div className="w-full h-full border border-neutral-500/50 bg-neutral-800/20 rounded p-8"></div>
    </PageContainerWrapper>
  );
};

export default PresentClass;
