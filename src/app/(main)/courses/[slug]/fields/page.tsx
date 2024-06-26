import PageContainerWrapper from "@/components/page-container-wrapper";
import { ArrowLeft } from "lucide-react";
import CourseFieldsTable from "@/components/page-components/courses/slug/fields/course-fields-table";
import { client } from "@/lib/hono";
import { notFound } from "next/navigation";
import Link from "next/link";

interface Props {
  params: { slug: string };
}

const CourseFields: React.FC<Props> = async ({ params: { slug } }) => {
  const response = await client.api.courses[":slug"].fields.$get({
    param: { slug },
  });
  const { data: course } = await response.json();

  if (!course) {
    return notFound();
  }

  return (
    <PageContainerWrapper
      title={`${course.name} Fields`}
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
        <CourseFieldsTable initialData={course.fields} course={course} />
      </div>
    </PageContainerWrapper>
  );
};

export default CourseFields;
