import PageContainerWrapper from "@/components/page-container-wrapper";
import { client } from "@/lib/hono";
import React from "react";
import EditCourseForm from "@/components/page-components/courses/crud/edit-course-form";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

interface Props {
  params: { slug: string };
}

const EditAcademy: React.FC<Props> = async ({ params: { slug } }) => {
  const response = await client.api.courses[":slug"].$get({
    param: { slug },
  });
  const { data: course } = await response.json();

  if (!course) {
    return notFound();
  }

  return (
    <PageContainerWrapper
      title="Edit Course"
      trail={
        <Link
          href="/courses"
          className="flex items-center gap-x-2 hover:bg-neutral-800 w-fit p-2 rounded"
        >
          <ArrowLeft /> Back
        </Link>
      }
    >
      <div className="w-full h-full border border-neutral-500/50 bg-neutral-800/20 rounded p-8">
        <div>
          <h3 className="text-2xl mb-3">Edit Course</h3>
          <EditCourseForm course={course} />
        </div>
      </div>
    </PageContainerWrapper>
  );
};

export default EditAcademy;
