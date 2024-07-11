import AcademyLecturersTable from "@/components/page-components/academies/slug/lecturers/academy-lecturers-table";
import PageContainerWrapper from "@/components/page-container-wrapper";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import React, { FC } from "react";

interface Props {
  params: { slug: string };
}

const page: FC<Props> = ({ params: { slug } }) => {
  return (
    <PageContainerWrapper
      title={`Manage Academy Lecturers`}
      trail={
        <Link
          href="/academies"
          className="flex items-center gap-x-2 hover:bg-neutral-800 w-fit p-2 rounded"
        >
          <ArrowLeft /> Back
        </Link>
      }
    >
      <AcademyLecturersTable slug={slug} />
    </PageContainerWrapper>
  );
};

export default page;
