import PageContainerWrapper from "@/components/page-container-wrapper";

import React, { FC } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ViewAcademyTabs from "@/components/page-components/academies/slug/view-academy-tabs";

interface Props {
  params: { slug: string };
}

const ViewAcademy: FC<Props> = async ({ params: { slug } }) => {
  return (
    <PageContainerWrapper
      title={`Academy Overview`}
      trail={
        <Link
          href="/academies"
          className="flex items-center gap-x-2 hover:bg-neutral-800 w-fit p-2 rounded"
        >
          <ArrowLeft /> Back
        </Link>
      }
    >
      <ViewAcademyTabs slug={slug} />
    </PageContainerWrapper>
  );
};

export default ViewAcademy;
