import React, { FC } from "react";

interface Props {}

const Separator: FC<Props> = ({}) => {
  return <div className="shrink-0 bg-border h-[1px] w-full my-4" />;
};

export default Separator;
