import PageContainerWrapper from "@/components/page-container-wrapper";
import { ArrowLeft } from "lucide-react";
import CourseMaterialsTable from "./_components/course-materials-table";
import { client } from "@/lib/hono";
import { notFound } from "next/navigation";
import Link from "next/link";

interface Props {
  params: { slug: string };
}

const CourseMaterials: React.FC<Props> = async ({ params: { slug } }) => {
  const response = await client.api.courses[":slug"].materials.$get({
    param: { slug },
  });
  const { data: course } = await response.json();

  if (!course) {
    return notFound();
  }

  return (
    <PageContainerWrapper
      title={`${course.name} Materials`}
      trail={
        <Link
          href={`/courses/${slug}`}
          className="flex items-center gap-x-2 hover:bg-neutral-800 w-fit p-2 rounded"
        >
          <ArrowLeft /> Back
        </Link>
      }
    >
      <div className="w-full h-full border border-neutral-500/50 bg-neutral-800/20 rounded p-8">
        <CourseMaterialsTable initialData={course.materials} course={course} />
      </div>
    </PageContainerWrapper>
  );
};

export default CourseMaterials;
