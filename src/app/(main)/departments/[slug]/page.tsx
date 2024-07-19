import PageContainerWrapper from "@/components/page-container-wrapper";

import React, { FC } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ViewDepartmentTabs from "@/components/page-components/departments/slug/view-department-tabs";

interface Props {
  params: { slug: string };
}

const ViewDepartment: FC<Props> = async ({ params: { slug } }) => {
  return (
    <PageContainerWrapper
      title={`Department Overview`}
      trail={
        <Link
          href="/departments"
          className="flex items-center gap-x-2 hover:bg-neutral-800 w-fit p-2 rounded"
        >
          <ArrowLeft /> Back
        </Link>
      }
    >
      <ViewDepartmentTabs slug={slug} />
    </PageContainerWrapper>
  );
};

export default ViewDepartment;
