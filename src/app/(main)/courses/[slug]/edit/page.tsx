import PageContainerWrapper from "@/components/page-container-wrapper";
import { client } from "@/lib/hono";
import React from "react";
import EditCourseForm from "../../_components/crud/edit-course-form";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import CreateFieldsForm from "../../_components/crud/create-fields";
import { notFound } from "next/navigation";
import ManageFields from "../../_components/crud/manage-fields";

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

  const editingIsDisabled = course.classCount > 0;

  return (
    <PageContainerWrapper
      title="Edit Academy"
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5">
          <div className="w-full">
            <h3 className="text-2xl mt-8 mb-3">Update Name</h3>
            <EditCourseForm course={course} />
            {editingIsDisabled && (
              <p className="mt-5 text-red-600/80">
                This course ran {course.classCount} times, and therefore, we
                cannot update its fields
              </p>
            )}
          </div>
          <div className="w-full">
            <h3 className="text-2xl mt-8 mb-3">Add Field</h3>
            <CreateFieldsForm course={course} disabled={editingIsDisabled} />
          </div>
        </div>
        <ManageFields course={course} disabled={editingIsDisabled} />
      </div>
    </PageContainerWrapper>
  );
};

export default EditAcademy;
