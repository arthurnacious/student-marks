import PageContainerWrapper from "@/components/page-container-wrapper";
import { client } from "@/lib/hono";
import React from "react";
import EditDepartmentForm from "@/components/page-components/departments/crud/edit-department-form";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

interface Props {
  params: { slug: string };
}

const EditDepartment: React.FC<Props> = async ({ params: { slug } }) => {
  const response = await client.api.departments[":slug"].$get({
    param: { slug },
  });
  const { data: department } = await response.json();

  if (!department) {
    return notFound();
  }

  return (
    <PageContainerWrapper
      title={`Edit ${department.name} Department`}
      trail={
        <Link
          href="/departments"
          className="flex items-center gap-x-2 hover:bg-neutral-800 w-fit p-2 rounded"
        >
          <ArrowLeft /> Back
        </Link>
      }
    >
      <div className="w-full h-full border border-neutral-500/50 bg-neutral-800/20 rounded p-8">
        <EditDepartmentForm department={department} />
      </div>
    </PageContainerWrapper>
  );
};

export default EditDepartment;
