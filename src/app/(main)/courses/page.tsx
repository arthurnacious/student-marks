import PageContainerWrapper from "@/components/page-container-wrapper";
import React, { FC } from "react";

interface Props {}

const CoursesPage: FC<Props> = ({}) => {
  return (
    <PageContainerWrapper title="Courses">
      <div className="w-full h-full border border-neutral-500/50 bg-neutral-800/20 rounded p-8">
        {/* <CoursesTable initialData={data} /> */}
        course data here
      </div>
    </PageContainerWrapper>
  );
};

export default CoursesPage;
