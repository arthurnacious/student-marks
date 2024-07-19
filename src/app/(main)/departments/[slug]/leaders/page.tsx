import DepartmentLeadersTable from "@/components/page-components/departments/slug/leaders/department-leaders-table";
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
      title={`Manage Department Leaders`}
      trail={
        <Link
          href="/departments"
          className="flex items-center gap-x-2 hover:bg-neutral-800 w-fit p-2 rounded"
        >
          <ArrowLeft /> Back
        </Link>
      }
    >
      <DepartmentLeadersTable slug={slug} />
    </PageContainerWrapper>
  );
};

export default page;
