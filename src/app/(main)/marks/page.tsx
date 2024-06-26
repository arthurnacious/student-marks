import PageContainerWrapper from "@/components/page-container-wrapper";
import React from "react";
import MarksDisplay from "@/components/page-components/users/marks-display";
interface Props {}

const Page: React.FC<Props> = () => {
  const studentId = "e61dec48-fd2d-4a2c-8e73-4b8fcbc5d032";

  return (
    <PageContainerWrapper title="Marks">
      <div className="w-full h-full border border-neutral-500/50 bg-neutral-800/20 rounded p-8">
        <MarksDisplay studentId={studentId} />
      </div>
    </PageContainerWrapper>
  );
};

export default Page;
