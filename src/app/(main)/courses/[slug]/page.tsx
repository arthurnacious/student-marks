import PageContainerWrapper from "@/components/page-container-wrapper";
import React, { FC } from "react";
import { client } from "@/lib/hono";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface Props {
  params: { slug: string };
}

const CoursesPage: FC<Props> = async ({ params: { slug } }) => {
  const response = await client.api.courses[":slug"].$get({
    param: { slug },
  });
  const { data: course } = await response.json();

  if (!course) {
    return notFound();
  }

  console.log({ course });

  return (
    <PageContainerWrapper
      title={course.name}
      trail={
        <Link
          href={`/courses`}
          className="flex items-center gap-x-2 hover:bg-neutral-800 w-fit p-2 rounded"
        >
          <ArrowLeft /> Back
        </Link>
      }
    >
      <div className="w-full h-full border border-neutral-500/50 bg-neutral-800/20 rounded p-8">
        <ul>
          <li>Name: {course.name}</li>
          {course.description && <li>Description: {course.description}</li>}
          {course.department && (
            <li>department: {course.department?.name} department</li>
          )}
          <li>Fields: {course.fields.map((field) => field.name).join(", ")}</li>
          <li>Ran {course.classCount} times</li>
          <li>
            Materials:{" "}
            {course.materials?.map((material) => material.name).join(", ")}
          </li>
        </ul>
      </div>
    </PageContainerWrapper>
  );
};

export default CoursesPage;
