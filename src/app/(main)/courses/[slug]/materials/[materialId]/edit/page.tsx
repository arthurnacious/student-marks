import PageContainerWrapper from "@/components/page-container-wrapper";
import EditmaterialForm from "./_components/edit-material-form";
import { ArrowLeft } from "lucide-react";
import { client } from "@/lib/hono";
import { notFound } from "next/navigation";
import Link from "next/link";
import BackButton from "@/components/back-button";

interface Props {
  params: { slug: string; materialId: string };
}

const CourseMaterials: React.FC<Props> = async ({
  params: { slug, materialId },
}) => {
  const response = await client.api.materials[":id"].$get({
    param: { id: materialId },
  });

  const { data: material } = await response.json();
  console.log(material);

  if (!material) {
    return notFound();
  }

  return (
    <PageContainerWrapper
      title={`Edit ${material.name}`}
      trail={
        <BackButton>
          <ArrowLeft /> Back
        </BackButton>
      }
    >
      <div className="w-full h-full border border-neutral-500/50 bg-neutral-800/20 rounded p-8">
        <EditmaterialForm material={material} courseSlug={slug} />
      </div>
    </PageContainerWrapper>
  );
};

export default CourseMaterials;
