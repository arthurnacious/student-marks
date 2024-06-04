import PageContainerWrapper from "@/components/page-container-wrapper";
import React, { FC } from "react";
import CoursesTable from "./_components/courses-table";
import { client } from "@/lib/hono";

interface Props {}

const CoursesPage: FC<Props> = async ({}) => {
  const response = await client.api.courses.$get();
  const data = await response.json();

  return (
    <PageContainerWrapper title="Courses">
      <div className="w-full h-full border border-neutral-500/50 bg-neutral-800/20 rounded p-8">
        <CoursesTable initialData={data} />
      </div>
    </PageContainerWrapper>
  );
};

export default CoursesPage;
