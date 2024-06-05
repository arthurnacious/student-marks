import BackButton from "@/components/back-button";
import PageContainerWrapper from "@/components/page-container-wrapper";
import { ArrowLeft } from "lucide-react";
import React, { FC } from "react";

interface Props {}

const NotFound: FC<Props> = ({}) => {
  return (
    <div className="flex flex-col p-10 gap-5">
      <BackButton>
        <ArrowLeft /> Back
      </BackButton>
      <div className="flex flex-col items-center justify-center px-auto md:px-6 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="sm:text-9xl text-6xl font-bold text-slate-200 dark:text-neutral-900 font-SpaceGrotesk">
            404
          </h1>
          <p className="text-lg text-gray-400 dark:text-gray-500">
            Oops, the page you&lsquo;re looking for doesn&lsquo;t exist.
          </p>
        </div>
        <BackButton className="inline-flex h-10 items-center justify-center rounded-md bg-gray-500 px-2 md:px-8 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-500 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300 text-nowrap">
          <ArrowLeft />
          Go back home
        </BackButton>
      </div>
    </div>
  );
};

export default NotFound;
