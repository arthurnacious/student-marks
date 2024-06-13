import PageContainerWrapper from "@/components/page-container-wrapper";
import { client } from "@/lib/hono";
import React from "react";
import EditAcademyForm from "../../_components/crud/edit-academy-form";
import Link from "next/link";
import { FaBackward } from "react-icons/fa";
import { ArrowLeft, StepBack } from "lucide-react";

interface Props {
  params: { slug: string };
}

const EditAcademy: React.FC<Props> = async ({ params: { slug } }) => {
  const response = await client.api.academies[":slug"].$get({
    param: { slug },
  });
  const { data: academy } = await response.json();

  if (!academy) notFound();

  return (
    <PageContainerWrapper
      title={`Edit ${academy.name} Academy`}
      trail={
        <Link
          href="/academies"
          className="flex items-center gap-x-2 hover:bg-neutral-800 w-fit p-2 rounded"
        >
          <ArrowLeft /> Back
        </Link>
      }
    >
      <div className="w-full h-full border border-neutral-500/50 bg-neutral-800/20 rounded p-8">
        <EditAcademyForm academy={academy} />
      </div>
    </PageContainerWrapper>
  );
};

export default EditAcademy;
