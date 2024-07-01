import AcademyHeadsTable from "@/components/page-components/academies/slug/heads/academy-heads-table";
import PageContainerWrapper from "@/components/page-container-wrapper";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import React from "react";

interface Props {
  params: { slug: string };
}

const page = ({ params: { slug } }) => {
  return (
    <PageContainerWrapper
      title={`Manage Academy Heads`}
      trail={
        <Link
          href="/academies"
          className="flex items-center gap-x-2 hover:bg-neutral-800 w-fit p-2 rounded"
        >
          <ArrowLeft /> Back
        </Link>
      }
    >
      <AcademyHeadsTable slug={slug} />
    </PageContainerWrapper>
  );
};

export default page;
