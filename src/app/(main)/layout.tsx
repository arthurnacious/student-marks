import React from "react";

interface Props {
  children: React.ReactNode;
}

const MainLayout: React.FC<Props> = ({ children }) => {
  return <main className="container mx-auto">{children}</main>;
};

export default MainLayout;
