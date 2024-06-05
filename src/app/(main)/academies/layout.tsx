import Navigation from "@/components/navigation";
import React from "react";

interface Props {
  children: React.ReactNode;
  modal: React.ReactNode;
}

const AcademiesLayout: React.FC<Props> = ({ children, modal }) => {
  return (
    <>
      {modal}
      {children}
    </>
  );
};

export default AcademiesLayout;
