import { cn } from "@/lib/utils";
import React from "react";

interface Props {
  title?: string;
  trail?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}

const PageContainerWrapper: React.FC<Props> = ({
  title,
  trail,
  className,
  children,
}) => {
  return (
    <div className={cn("flex flex-col p-10 ml-20 w-full gap-5", className)}>
      {!!title && (
        <h1 className="text-4xl text-neutral-200 uppercase font-SpaceGrotesk">
          {title}
        </h1>
      )}
      {!!trail && trail}
      {children}
    </div>
  );
};

export default PageContainerWrapper;
