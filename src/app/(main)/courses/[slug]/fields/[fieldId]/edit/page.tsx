import PageContainerWrapper from "@/components/page-container-wrapper";
import EditFieldForm from "@/components/page-components/courses/slug/fields/fieldId/edit-field-form";
import { ArrowLeft } from "lucide-react";
import { client } from "@/lib/hono";
import { notFound } from "next/navigation";
import BackButton from "@/components/back-button";

interface Props {
  params: { slug: string; fieldId: string };
}

const Coursefields: React.FC<Props> = async ({ params: { slug, fieldId } }) => {
  const response = await client.api.fields[":id"].$get({
    param: { id: fieldId },
  });

  const { data } = await response.json();

  if (!data) {
    return notFound();
  }

  return (
    <PageContainerWrapper
      title={`Edit ${data.name} field`}
      trail={
        <BackButton>
          <ArrowLeft /> Back
        </BackButton>
      }
    >
      <div className="w-full h-full border border-neutral-500/50 bg-neutral-800/20 rounded p-8">
        <EditFieldForm field={data} courseSlug={slug} />
      </div>
    </PageContainerWrapper>
  );
};

export default Coursefields;
