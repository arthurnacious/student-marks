import DepartmentInventoriesTable from "@/components/page-components/departments/slug/inventory/department-inventory-table";
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
      title={`Manage Department Inventories`}
      trail={
        <Link
          href="/departments"
          className="flex items-center gap-x-2 hover:bg-neutral-800 w-fit p-2 rounded"
        >
          <ArrowLeft /> Back
        </Link>
      }
    >
      <DepartmentInventoriesTable slug={slug} />
    </PageContainerWrapper>
  );
};

export default page;
