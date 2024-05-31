import PageContainerWrapper from "@/components/page-container-wrapper";
import { client } from "@/lib/hono";
import React from "react";
import EditAcademyForm from "../../_components/crud/edit-academy-form";

interface Props {
  params: { slug: string };
}

const EditAcademy: React.FC<Props> = async ({ params: { slug } }) => {
  const response = await client.api.academies[":slug"].$get({
    param: { slug },
  });
  const { data: academy } = await response.json();
  return (
    <PageContainerWrapper title="Edit Academy">
      <div className="w-full h-full border border-neutral-500/50 bg-neutral-800/20 rounded p-8">
        <EditAcademyForm academy={academy} />
      </div>
    </PageContainerWrapper>
  );
};

export default EditAcademy;
