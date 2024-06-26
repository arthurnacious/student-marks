import { Button } from "@/components/ui/button";
import React, { FC } from "react";
import BackButton from "./_back-button";
import BackBackdrop from "./_back-backdrop";
import EditAcademyForm from "../../../../../../components/page-components/academies/crud/edit-academy-form";
import { client } from "@/lib/hono";

interface Props {
  params: { slug: string };
}

const Page: FC<Props> = async ({ params: { slug } }) => {
  const response = await client.api.academies[":slug"].$get({
    param: { slug },
  });
  const { data: academy } = await response.json();
  return (
    <div className="absolute">
      <BackBackdrop />
      <div className="container flex items-center h-ful max-w-2xl mx-auto">
        <div className="fixed left-[50%] top-[50%] z-[100] grid w-full max-w-2xl translate-x-[-50%] translate-y-[-50%] gap-4 border bg-neutral-950 p-6 shadow-lg duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg">
          <div className="w-full h-full border border-neutral-500/50 bg-neutral-800/20 rounded p-8">
            <h1 className="text-4xl text-neutral-200 uppercase pb-8">
              Edit Academy
            </h1>
            <EditAcademyForm academy={academy} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
