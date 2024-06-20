import PageContainerWrapper from "@/components/page-container-wrapper";
import React, { FC } from "react";
import { client } from "@/lib/hono";
import { not } from "drizzle-orm";
import { notFound } from "next/navigation";

interface Props {
  params: { slug: string };
}

const PresentClass: FC<Props> = async ({ params: { slug } }) => {
  const data = await client.api.classes[":slug"].$get({
    param: { slug },
  });
  const classData = await data.json();

  console.log({ classData });

  if (!classData) return notFound();

  return (
    <PageContainerWrapper
      title={`Present ${classData.data?.course.name} Class`}
    >
      <div className="w-full h-full border border-neutral-500/50 bg-neutral-800/20 rounded p-8"></div>
    </PageContainerWrapper>
  );
};

export default PresentClass;
