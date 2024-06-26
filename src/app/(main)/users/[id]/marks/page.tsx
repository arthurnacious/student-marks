import PageContainerWrapper from "@/components/page-container-wrapper";
import React from "react";
import { client } from "@/lib/hono";
import { cn } from "@/lib/utils";
import {
  calculateBackgroundColor,
  calculateTotal,
  groupData,
  transformData,
} from "@/lib/marks-functions";
import { notFound } from "next/navigation";
import BackButton from "@/components/back-button";
import { ArrowLeft } from "lucide-react";
import MarksDisplay from "@/components/page-components/users/marks-display";
interface Props {
  params: {
    id: string;
  };
}

const UserMarksPage: React.FC<Props> = ({ params: { id } }) => {
  return (
    <PageContainerWrapper
      title="Marks"
      trail={
        <>
          <BackButton>
            <ArrowLeft /> Back
          </BackButton>
        </>
      }
    >
      <div className="w-full h-full border border-neutral-500/50 bg-neutral-800/20 rounded p-8">
        <MarksDisplay studentId={id} />
      </div>
    </PageContainerWrapper>
  );
};

export default UserMarksPage;
