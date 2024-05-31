import React from "react";

interface Props {
  title?: string;
  trail?: React.ReactNode;
  children?: React.ReactNode;
}

const PageContainerWrapper: React.FC<Props> = ({ title, trail, children }) => {
  return (
    <div className="flex flex-col p-10 ml-20 w-full gap-5">
      {!!title && (
        <h1 className="text-4xl text-neutral-200 uppercase">{title}</h1>
      )}
      {!!trail && trail}
      {children}
    </div>
  );
};

export default PageContainerWrapper;
