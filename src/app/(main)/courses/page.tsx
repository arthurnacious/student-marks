import PageContainerWrapper from "@/components/page-container-wrapper";
import React, { FC } from "react";
import CoursesTable from "@/components/page-components/courses/courses-table";

interface Props {}

const CoursesPage: FC<Props> = ({}) => {
  return (
    <PageContainerWrapper title="Courses">
      <div className="w-full h-full border border-neutral-500/50 bg-neutral-800/20 rounded p-8">
        <CoursesTable />
      </div>
    </PageContainerWrapper>
  );
};

export default CoursesPage;
