import PageContainerWrapper from "@/components/page-container-wrapper";
import React, { FC } from "react";
import ClassTabs from "@/components/page-components/classes/slug/tabs/class-tabs";

interface Props {
  params: { slug: string };
}

const PresentClass: FC<Props> = ({ params: { slug } }) => {
  return (
    <PageContainerWrapper title={`Presenting Class`}>
      <div className="w-full h-full border border-neutral-500/50 bg-neutral-800/20 rounded p-8">
        <ClassTabs slug={slug} />
      </div>
    </PageContainerWrapper>
  );
};

export default PresentClass;
