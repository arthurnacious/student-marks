import React from "react";

interface Props {
  title?: string;
  children?: React.ReactNode;
}

const PageContainerWrapper: React.FC<Props> = ({ title, children }) => {
  return (
    <div className="flex flex-col p-10 ml-20 w-full gap-5">
      {!!title && (
        <h1 className="text-4xl text-neutral-200 uppercase">{title}</h1>
      )}
      {children}
    </div>
  );
};

export default PageContainerWrapper;
