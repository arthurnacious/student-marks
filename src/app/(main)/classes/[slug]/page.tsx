import PageContainerWrapper from "@/components/page-container-wrapper";
import React, { FC } from "react";
import { client } from "@/lib/hono";
import { not } from "drizzle-orm";
import { notFound } from "next/navigation";
import AddStudents from "./_components/add-students";

interface Props {
  params: { slug: string };
}

const PresentClass: FC<Props> = async ({ params: { slug } }) => {
  const response = await client.api.classes[":slug"].$get({
    param: { slug },
  });
  const { data: theClass } = await response.json();

  console.log({ theClass });

  if (!theClass) return notFound();

  return (
    <PageContainerWrapper title={`Presenting ${theClass.course.name} Class`}>
      <div className="w-full h-full border border-neutral-500/50 bg-neutral-800/20 rounded p-8">
        <AddStudents course={theClass.course} />
      </div>
    </PageContainerWrapper>
  );
};

export default PresentClass;
